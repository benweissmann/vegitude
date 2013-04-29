require 'set'

class Search
  FRACTION_REGEX = /(\d+)\/(\d+)/
  DECIMAL_REGEX = /\d+\.\d+/
  INTEGER_REGEX = /\d+/

  def initialize params
    @forbidden = Set.new
    restrictions = []

    # handle standard restrictions
    restrictions.push Restriction.vegan if params["vegan"]=="true"
    restrictions.push Restriction.vegetarian if params["vegetarian"]=="true"
    restrictions.push Restriction.gluten_free if params["gf"]=="true"
    restrictions.push Restriction.lactose_free if params["lf"]=="true"

    # handle custom restrictions
    if params["custom"]
      params["custom"].each do |name|
        if (restriction = Restriction.find_by_name(name))
          restrictions.push restriction
        end

        if (ingredient = Ingredient.find_by_name(name))
          @forbidden.add ingredient.id
        end
      end
    end

    # expand restrictions
    restrictions.each do |restriction|
      restriction.ingredient_ids.each do |id|
        @forbidden.add id
      end
    end
  end

  def query search_term
    get_results(search_term) do |recipe|
      assemble_recipe_data recipe
    end
  end

  private

  # yields Recipes to the given block, which should return nil if the result
  # is to be discarded or an object if the result has been accepted. Once
  # max_recipes Recipes have been yielded, or desired_results have accepted,
  # returns an array with the objects returned for accepted results.
  def get_results search_term, max_recipes=25, desired_results=10
    ids = DBUtils.execute(["
      SELECT recipe_id,
        MATCH (text) AGAINST (?) AS relevance 
        FROM search_data 
        WHERE MATCH(text) AGAINST (? IN BOOLEAN MODE) 
        HAVING relevance > 0  
        ORDER by relevance desc
        LIMIT ?
    ", search_term, search_term, max_recipes]).to_a.map(&:first)

    results = []

    ids.each do |id|
      recipe = Recipe.includes([{:inclusions => :ingredient}, :source]).find id
      result = yield(recipe)

      unless result.nil?
        results.push result
        return results if results.length >= desired_results
      end
    end

    return results
  end

  def forbidden? ingredient
    @forbidden.include? ingredient.id
  end

  def substitutions ingredient
    ingredient.substitutions.reject{|ingred| forbidden? ingred}
  end

  def apply_ratio amount, ratio
    return amount if ratio == 1

    if fraction = FRACTION_REGEX.match(amount)
      new_amount = format_quantity((fraction[1].to_f / fraction[2]) * ratio)
      return amount.sub(FRACTION_REGEX, new_amount)
    elsif decimal = DECIMAL_REGEX.match(amount)
      new_amount = format_quantity(decimal[0].to_f * ratio)
      return amount.sub(DECIMAL_REGEX, new_amount)
    elsif int = INTEGER_REGEX.match(amount)
      new_amount = format_quantity(int[0].to_i * ratio).to_s
      return amount.sub(INTEGER_REGEX, new_amount)
    end

    return amount
  end

  def format_quantity quantity
    return quantity.to_i.to_s if (quantity.to_i - quantity < 0.001)

    return quantity.round(3).to_s
  end

  # returns recipe data or nil if recipe can't be fit the this Search's
  # restrictions
  def assemble_recipe_data recipe
    ingredients = []

    recipe.inclusions.each do |inclusion|
      ingredient = inclusion.ingredient
      ingredient_data = {}

      # deal with substitutons
      if forbidden? ingredient
        subs = substitutions(ingredient)
        if subs.length == 0
          # no substitutions, reject this recipe
          return nil
        else
          # add the substitution
          ingredient_data["substitute"] = subs.map do |sub|
            [apply_ratio(inclusion.amount, sub.ratio), sub.name]
          end
        end
      end

      # add the rest of the data
      ingredient_data["original"] = [inclusion.amount, ingredient.name]

      # TODO: fix this
      ingredient_data["where_to_buy"] = ["Whole Foods", "http://wholefoodsmarket.com/stores/list"]

      ingredients.push ingredient_data
    end

    {
      "name"        => recipe.name,
      "source"      => [recipe.source.name, recipe.url],
      "time"        => recipe.time,
      "servings"    => recipe.servings,
      "directions"  => recipe.directions,
      "ingredients" => ingredients
    }
  end
end