(function(exports) {

    // formats a (quantity, ingredient) tuple into a string
    function formatIngred(ingred) {
        return ingred[0] + " " + ingred[1];
    }

    // given a (title, url) tuple, returns an <a> tag
    function makeLink(params) {
        return "<a href=\"" + params[1] + "\" target=\"_blank\">" + params[0] + "</a>";
    }

    // given directions and a list of ingredients, produces substituted
    // directions
    function subDirections(directions, ingreds) {
        ingreds.forEach(function(ingred) {
            if(ingred.substitute) {
                directions = directions.replace(new RegExp(ingred.original[1], 'g'), ingred.substitute[1])
            }
        });

        return directions
    }

    var current = undefined;

    var RecipePane = {
        // displays the recipe with the given name
        // if noFade is true, skips fading
        display: function(name, noFade) {
            if(noFade) {
                var recipe = RECIPE_PANE_DATA[name];

                $("#recipe-name").text(name);
                $("#recipe-source").text(recipe.source[0])
                                   .attr("href", recipe.source[1]);
                $("#recipe-time").text(recipe.time);
                $("#recipe-difficulty").text(recipe.difficulty);

                $("#recipe-ingreds").empty();            
                recipe.ingredients.forEach(function(ingredient) {
                    var listItem;

                    if(ingredient.substitute) {
                        var listItem = $("<li />");
                        listItem.append('<span class="ingred-orig">' + formatIngred(ingredient.original));
                        listItem.append('<span class="ingred-sub">' + formatIngred(ingredient.substitute));

                        var btn = $("<button class=\"btn btn-small\"><i class=\"icon-question-sign\"></i></button>")

                        btn.popover({
                            html: "true",
                            placement: "right",
                            trigger: "hover ",
                            title: ingredient.original[1],
                            delay: { hide: 100 },
                            container: btn[0],
                            content: ("<b>substitution: </b>" + formatIngred(ingredient.substitute) + "<br />" +
                                     "<b>where to buy: </b>" + makeLink(ingredient.where_to_buy) + "<br />" +
                                     "<b>alternatives: </b>" + _.map(ingredient.other_substitutions, function(sub) {
                                         return formatIngred(sub);
                                     }).join(", "))
                        });

                        listItem.append(btn);
                    }
                    else {
                        listItem = $("<li>" + formatIngred(ingredient.original) + "</li>");
                    }

                    $("#recipe-ingreds").append(listItem);
                });
                
                $("#recipe-directions-orig").text(recipe.directions);
                $("#recipe-directions-sub").text(subDirections(recipe.directions, recipe.ingredients));   
            }
            else {
                if(current == name) {
                    return;
                }
                else {
                    current = name;
                }
                
                $("#recipe-pane").fadeOut(250, function() {
                    RecipePane.display(name, true);
                    $("#recipe-pane").fadeIn(250);
                });
            }
            
        }
    }

    // set up original / substituted buttons
    $(function() {
        $("#recipe-show-orig").click(function() {
            $("#recipe-pane").removeClass("substituted").addClass("original");
        });

        $("#recipe-show-sub").click(function() {
            $("#recipe-pane").removeClass("original").addClass("substituted");
        });
    })

    exports.RecipePane = RecipePane;
})(window)