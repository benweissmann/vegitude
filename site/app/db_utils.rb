module DBUtils
  class << self
    def execute query
      sql = ActiveRecord::Base.__send__(:sanitize_sql, query, '')
      ActiveRecord::Base.connection.execute sql
    end

    def update_search_table
      puts "Removing index..."
      remove_fulltext_index

      puts "Removing data..."
      truncate_search_data

      puts "Rebuilding data..."
      build_search_data

      puts "Rebuilding index..."
      add_fulltext_index
    end

    private

    def add_fulltext_index
      execute "
        ALTER TABLE `vegitude`.`search_data`
          ADD FULLTEXT INDEX `recipe_text_search` (`text` ASC);
      "
    end

    def truncate_search_data
      execute "TRUNCATE TABLE `vegitude`.`search_data`"
    end

    def remove_fulltext_index
      execute "
        ALTER TABLE `vegitude`.`search_data` 
          DROP INDEX `recipe_text_search`;
      "
    end

    def build_search_data
      puts "  Constructing insert..."
      total = Recipe.count

      inserts = Recipe.includes(:ingredients).all.each_with_index.map do |recipe, idx|
        text = ActiveRecord::Base.connection.quote(
          (recipe.name + " ")*10 +
          recipe.ingredients.all.map(&:name).join(" ") + " " + 
          recipe.directions
        )

        puts "    #{idx+1}/#{total}"

        "(#{recipe.id}, #{text})"
      end

      puts "  Running insert..."
      sql = "INSERT INTO search_data (`recipe_id`, `text`) VALUES #{inserts.join(", ")}"
      execute sql
    end
  end
end