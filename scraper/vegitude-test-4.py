import mechanize
from bs4 import BeautifulSoup
import inflect
import mysql.connector
import hashlib

UNITS = ["cup", "cups", "can", "cans", "pint", "lbs.", "lb", "g", "gram", "grams", "clove", "cloves", "slice", "slices", "packet", "packets", "pkg", "pkg.", "package", "piece", "pieces", "few", "drop", "drops", "curls", "bottle", "container", "dozen", "tbsp", "tsp", "tablespoon", "tablespoons", "pinch", "some", "pound", "pounds", "ounces", "ounce", "teaspoon", "teaspoons"]
ADJECTIVES = ["big", "small", "drained", "bottled", "good-quality", "thinly", "roughly", "chunky", "crushed", "1%", "2%", "skim", "skimmed", "smooth", "cubed", "little", "large", "minced", "finely", "peeled", "chopped", "diced", "toasted", "sliced", "soaked", "freshly", "fresh", "fileted", "medium", "bitchy", "pre-washed", "dickish", "mashed", "shredded", "cooked", "ripe", "washed", "grated", "dry", "minced"]
measurements = []
p=inflect.engine()
recipe_counter = 200
ingredient_counter = 1100
inclusion_counter = 1100

def main():
    f = open('commands.txt', 'r+')
    for x in range(21,100):
        #print "http://www.nibbledish.com/recipes/page/"+str(x)
        response = mechanize.urlopen("http://www.nibbledish.com/recipes/page/"+str(x))
        soup = BeautifulSoup(response, "html5lib")
        for link in soup.find_all("a", {"class": "recipe_pic"}):
            ##print link
            ##if link['class'] == "recipe_pic":
            getRecipes(link.get('href'), f)

#gets the recipe from the page
#this was working and then I added a bunch of new things
def getRecipes(href, openFile):
    #print href
    response = mechanize.urlopen("http://www.nibbledish.com"+href)
    soup = BeautifulSoup(response, "html5lib")
    #printInfo(soup)
    parsed_directs = ""
    firstLine = True
    for x in soup.find(id="method_inner").stripped_strings:
        if firstLine:
            firstLine = False
        else:
            parsed_directs = parsed_directs + x + " "
    parsed_ingreds = parseInfo(soup)
    make_mysql(soup, parsed_directs, parsed_ingreds, href, openFile)

#prints the info from the page
#this has been tested
def printInfo(soup):
    
    print "DIRECTIONS"
    for x in soup.find(id="method_inner").stripped_strings:
        print x

    print "INGREDIENTS"
    span = soup.find(id="recipe_ingredients").stripped_strings
    afterTags = False
    for x in span:
        x = x.lower()
        if x=="tags":
            afterTags = True
        if not afterTags:
            if x.split(',')[0] != False and x.split(',')[0] != True:
                try:
                    temp = p.singular_noun(str(x.split(',')[0]))
                    #if temp == False:
                    #    print x.split(',')[0]
                    #else:
                    #    print temp
                except:
                    continue

#parses the ingredients from the page
#this hasn't been tested but I'm pretty sure it works
def parseInfo(soup):    
    #print "PARSED INGREDIENTS"
    span = soup.find(id="recipe_ingredients").stripped_strings
    afterTags = False
    tups = []
    for x in span:
        x = x.lower()
        if x=="tags":
            afterTags = True
        if not afterTags:
            if x.split(',')[0] != False and x.split(',')[0] != True:
                try:
                    temp = p.singular_noun(str(x.split(',')[0]))
                    if temp == False:
                        tups.append(parse_ingred(x.split(',')[0]))
                    else:
                        tups.append(parse_ingred(temp))
                except:
                    continue
    return tups

#given one ingredient in form [amount][unit][name], returns ([amount unit], [name]) stripped of extra words
#this has been tested
def parse_ingred(ingred):
    #splits whole line into numbers and words
    split_words = ingred.split()
    words = []

    #remove parenthetical statements
    between_parens = False
    for z in split_words:
        if between_parens == True:
            if z.find(")") != -1:
                between_parens = False
        else:
            if z.find("(") != -1:
                if z.find(")") == -1:
                    between_parens = True
            else:
                words.append(z)
    
    counter = 0
    inclusion = ""
    ingredient = ""

    #loops through the line to find the numbers
    result = find_amount(counter, words)
    inclusion = result[1]
    counter = result[0]

    #checks if the word plus is used
    if words[counter] == 'plus':
        inclusion = inclusion + words[counter] + " "
        counter = counter + 1
        moreUnits = find_amount(counter, words)
        inclusion = inclusion + moreUnits[1]
        counter = counter + result[0]

    #removes unnecessary words from the ingredient to make our database better
    while(counter < len(words)):
        if words[counter] not in ADJECTIVES:
            ingredient = ingredient + words[counter] + " "
        counter = counter + 1

    #formats and returns tuple
    if len(inclusion) > 0 and inclusion[len(inclusion) - 1:] == " ":
        inclusion = inclusion[0:len(inclusion) - 1]
    if len(ingredient) > 0 and ingredient[len(ingredient) - 1:] == " ":
        ingredient = ingredient[0:len(ingredient) - 1]
    return (inclusion, ingredient)

#finds the number and unit part of the string
#this has been tested
def find_amount(counter, arr):
    isNum = True
    toReturn = ""
    while(isNum and counter < len(arr)):
        try:
            int(arr[counter])
            #whole numbers and decimals get here
            toReturn = toReturn + arr[counter] + " "
            counter = counter + 1
        except ValueError:
            if "/" in arr[counter]:
                #fractions get here
                toReturn = toReturn + arr[counter] + " "
                counter = counter + 1
            else:
                #something that wasn't a number was found. end loop
                isNum = False

    #checks to see if there is a unit after the number (there won't necessarily be one)
    isUnit = True
    while(isUnit and counter < len(arr)):
        if arr[counter] not in UNITS:
            isUnit = False
        else:
            toReturn = toReturn + arr[counter] + " "
            counter = counter + 1
                
    return (counter, toReturn)

#takes parsed info and turns it into mysql commands in a txt file
#this is the thing that needs to be tested. There are certain parts that are incorrect; the mysql commands
# are writing to the wrong server, for example. The code does write to a text file correctly but I have only
# tested it with a limit amount of input since I can't scrape the web
def make_mysql(soup, directions, ingreds, href, f):
    global ingredient_counter
    global inclusion_counter
    global recipe_counter
    directions = directions.replace("'", "`")
    directions = directions.replace('"', "`")
    

    #get the title
    stupidCounter = 0
    for x in soup.find(id="method_inner").stripped_strings:
        if stupidCounter==0:
            #print x
            title = x
        stupidCounter=stupidCounter+1
    title = title[12:]
    title = title.replace("'", "`")
    title = title.replace('"', "`")
    source_id = "2"
    url = "http://www.nibbledish.com"+href
    #TODO: miren+v needs replacing here
    recipe_command = "INSERT INTO `vegitude`.`recipes` (id, name, source_id, url, directions) VALUES ('"
    recipe_command = recipe_command + str(recipe_counter) + "', '"
    recipe_command = recipe_command + title + "', '" + source_id + "', '" + url + "', '" + directions + "');"
    recipe_command = recipe_command.encode('ascii', 'ignore')
    ##recipe_command = recipe_command.replace("u'\xa0'", "")
    f.write(recipe_command+'\n')

    #writes mysql depending on whether or not an ingredient is already in the database
    #TODO: the next line doesn't connect to the database correctly
    config = {
        'user':'vegitude',
        'password': "7096ko&F2vxB$0T1",
        'host':'vegitude.comidlzrm4xq.us-west-2.rds.amazonaws.com',
        'database':'vegitude'
    }
    
    con = mysql.connector.connect(**config)
    
    firstIngred = True
    
    for ingred in ingreds:
        
        if ingred[1]=="" or firstIngred:
            firstIngred = False
            continue
        cur = con.cursor()
        command = ("SELECT id FROM ingredients WHERE name = %s")
        args = (ingred[1],)
        cur.execute(command, args)
        rowVal = cur.fetchone()
        #this might be supposed to be cur.rowcount is null?
        if rowVal==None:
            #add ingred to db
            #TODO: miren+v needs replacing here
            ingred_command = ("INSERT INTO `vegitude`.`ingredients` (id, name) VALUES (%s, %s)")
            ingred_data = (ingredient_counter, str(ingred[1]))
            #print ingred_data
            cur.execute(ingred_command, ingred_data)
            
            #add inclusion
            #TODO: miren+v needs replacing here
            inclu_command = "INSERT INTO `vegitude`.`inclusions` (recipe_id, ingredient_id, amount) VALUES ('"
            inclu_command = inclu_command + str(recipe_counter) + "', '"
            inclu_command = inclu_command + str(ingredient_counter) + "', '" + ingred[0] + "');\n"
            f.write(inclu_command)

            #increment things that were added
            ingredient_counter = ingredient_counter + 1
            inclusion_counter = inclusion_counter + 1
        else:
            #the following line might be wrong, not sure if cur[0] is the right way to access the first row
            row = rowVal
            ingred_id = row[0]
            #add inclusion
            #TODO: miren+v needs replacing here
            inclu_command = "INSERT INTO `vegitude`. `inclusions` (recipe_id, ingredient_id, amount) VALUES ('"
            inclu_command = inclu_command + str(recipe_counter) + "', '"
            inclu_command = inclu_command + str(ingred_id) + "', '" + ingred[0] + "');\n"
            f.write(inclu_command)

            #increment things that were added
            inclusion_counter = inclusion_counter + 1     
    #increment things that were added
    recipe_counter = recipe_counter + 1
    con.commit()

main()











