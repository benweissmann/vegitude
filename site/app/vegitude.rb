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
require 'search'
require 'db_utils'

class Vegitude < Sinatra::Application
  get '/recipes' do
    Search.new(params).query(params["query"]).to_json
  end
end