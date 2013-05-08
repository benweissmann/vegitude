module Tagger
  KEY = YAML::load(File.open(File.join(APP_DIR, 'keys.yml')))['tagger']

  def self.submit params
    if params['password'] != KEY
      return "Password incorrect. Use the back button to return to the previous page and enter the correct password."
    end

    if params['data']
      params['data'].each do |id, rests|
        ingred = Ingredient.find(id)
        ingred.restriction_ids = rests.keys
        ingred.save!
      end
    end

    params['ingreds'].split(',').each do |id|
      ingred = Ingredient.find(id)
      ingred.reviewed_by = params['user']
      ingred.save!
    end

    return true
  end
end
