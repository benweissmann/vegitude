(function(exports) {
    "use strict";

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
                directions = directions.replace(new RegExp(ingred.original[1], 'g'), ingred.substitute[0][1])
            }
        });

        return directions
    }

    // replaces newlines with <br /> and escape html chars
    function htmlize(text) {
        return text.replace(/&/g, "&amp;")
                   .replace(/</g, "&lt;")
                   .replace(/>/g, "&gt;")
                   .replace(/"/g, "&quot;")
                   .replace(/'/g, "&#039;")
                   .replace(new RegExp("\n","g"), "<br />");
    }

    var current = undefined;

    var RecipePane = {
        // displays the recipe with the given name
        // if noFade is true, skips fading
        display: function(recipe, noFade) {
            if(noFade) {
                $("#recipe-name").text(recipe.name);
                $("#recipe-source").text(recipe.source[0])
                                   .attr("href", recipe.source[1]);

                $("#recipe-ingreds").empty();
                var hasSubstitutions = false;  
                recipe.ingredients.forEach(function(ingredient) {
                    var listItem;

                    if(ingredient.substitute) {
                        hasSubstitutions = true;

                        var listItem = $("<li />");
                        listItem.append('<span class="ingred-orig">' + formatIngred(ingredient.original));
                        listItem.append('<span class="ingred-sub">' + formatIngred(ingredient.substitute[0]));

                        var btn = $("<button class=\"btn btn-small\"><i class=\"icon-question-sign\"></i></button>")

                        var content = "<b>substitution: </b>" + formatIngred(ingredient.substitute[0]) + "<br />"

                        if(ingredient.substitute.length > 1) {
                            content += "<b>alternatives: </b>" + _.map(ingredient.substitute.slice(1), function(sub) {
                                return formatIngred(sub);
                            }).join(", ")
                        }
                        else {
                            content += "<b>alternatives: </b>none"
                        }


                        btn.popover({
                            html: "true",
                            placement: "right",
                            trigger: "hover ",
                            title: ingredient.original[1],
                            delay: { hide: 100 },
                            container: btn[0],
                            content: content
                        });

                        listItem.append(btn);
                    }
                    else {
                        listItem = $("<li>" + formatIngred(ingredient.original) + "</li>");
                    }

                    $("#recipe-ingreds").append(listItem);
                });

                console.log(hasSubstitutions);

                if(hasSubstitutions) {
                    $("#recipe-ingred-toggle").show();
                }
                else {
                    $("#recipe-ingred-toggle").hide();
                }
                
                $("#recipe-directions-orig").html(htmlize(recipe.directions));
                $("#recipe-directions-sub").html(htmlize(subDirections(recipe.directions, recipe.ingredients)));   
            }
            else {
                if(current == recipe.name) {
                    return;
                }
                else {
                    current = recipe.name;
                }
                
                $("#recipe-pane").fadeOut(250, function() {
                    RecipePane.display(recipe, true);
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