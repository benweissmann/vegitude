require 'sinatra'

class Vegitude < Sinatra::Application
  get '/hi' do
    "Hello World!"
  end
end