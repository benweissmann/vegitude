class Recipe < ActiveRecord::Base
  belongs_to :source
  has_many :inclusions
  has_many :ingredients, :through => :inclusions
end

class Source < ActiveRecord::Base
  has_many :recipes
end

class Inclusion < ActiveRecord::Base
  belongs_to :recipe
  belongs_to :ingredient
end

class Ingredient < ActiveRecord::Base
  has_many :inclusions
  has_many :recipes, :through => :inclusions
  has_and_belongs_to_many :restrictions

  has_many :substitutions_1, :class_name => "Substitution", :foreign_key => "ingredient_1"
  has_many :substitutions_2, :class_name => "Substitution", :foreign_key => "ingredient_2"

  def substitutions
    Ingredient.select('ingredients.*, COALESCE(sub1.ratio, 1/sub2.ratio) AS ratio').
               joins('LEFT OUTER JOIN substitutions sub1 ON ingredients.id=sub1.ingredient_1').
               joins('LEFT OUTER JOIN substitutions sub2 ON ingredients.id=sub2.ingredient_2').
               where(['sub1.ingredient_2=? OR sub2.ingredient_1=?', self.id, self.id])
  end
end

class Substitution < ActiveRecord::Base
  belongs_to :ingredient_1, :class_name => "Ingredient", :foreign_key => "ingredient_1"
  belongs_to :ingredient_2, :class_name => "Ingredient", :foreign_key => "ingredient_2"
end

class Restriction < ActiveRecord::Base
  has_and_belongs_to_many :ingredients

  def ingredient_ids
    @ingredient_ids ||= DBUtils.execute(["SELECT ingredient_id FROM ingredients_restrictions WHERE restriction_id = ?", self.id]).to_a.flatten
  end

  class << self
    def vegan
      find(1)
    end

    def vegetarian
      find(2)
    end

    def gluten_free
      find(4)
    end

    def lactose_free
      find(3)
    end
  end
end