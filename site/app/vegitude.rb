APP_DIR = File.dirname(__FILE__)
$:.push APP_DIR

require 'sinatra'
require 'yaml'
require 'active_record'


DB_PARAMS = YAML::load(File.open(File.join(APP_DIR, 'database.yml')))
ActiveRecord::Base.establish_connection(
  adapter:  "mysql2", 
  host:     DB_PARAMS["host"],
  database: DB_PARAMS["database"],
  username: DB_PARAMS["username"],
  password: DB_PARAMS["password"],
  port:     DB_PARAMS["port"]
)

require 'models'
require 'db_utils'

def tagger
  @items = Ingredient.where(:reviewed_by => nil).order("RAND()").limit(50)

  @fuzzy = Ingredient.where(:reviewed_by => 'fuzzy').count
  @miren = Ingredient.where(:reviewed_by => 'miren').count
  @trevor = Ingredient.where(:reviewed_by => 'trevor').count
  @total = Ingredient.count

  @restrictions = Restriction.all
  erb :tagger
end

class Vegitude < Sinatra::Application
  get '/recipes' do
    require 'search'
    Search.new(params).query(params["query"]).to_json
  end

  get '/tagger' do
    tagger
  end

  post '/tagger' do
    require 'tagger'
    result = Tagger.submit(params)

    if result == true
      tagger
    else
      result
    end
  end
end