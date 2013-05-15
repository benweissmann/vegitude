require './vegitude'

puts "Generating JSON..."
json = (Restriction.where("id > 4").map(&:name) + Ingredient.all.map(&:name)).to_json

puts "Writing JSON..."
File.open('../data/autocomplete.json', 'w') do |f|
  f.puts json
end