(function(exports) {

    // formats a (quantity, ingredient) tuple into a string
    function formatIngred(ingred) {
        return ingred[0] + " " + ingred[1];
    }

    // given a (title, url) tuple, returns an <a> tag
    function makeLink(params) {
        return "<a href=\"" + params[1] + "\">" + params[0] + "</a>";
    }

    var RecipePane = {
        display: function(name) {
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

                    listItem.popover({
                        html: "true",
                        placement: "right",
                        trigger: "manual ",
                        title: ingredient.original[1],
                        delay: { hide: 100 },
                        content: ("<b>substitution:</b>" + formatIngred(ingredient.substitute) + "<br />" +
                                 "<b>where to buy:</b>" + makeLink(ingredient.where_to_buy) + "<br />" +
                                 "<b>alternatives:</b>" + _.map(ingredient.other_substitutions, function(sub) {
                                     return formatIngred(sub);
                                 }).join(", "))
                    });

                    listItem.addClass("has-details");
                }
                else {
                    listItem = $("<li>" + formatIngred(ingredient.original) + "</li>");
                }

                $("#recipe-ingreds").append(listItem);
            });
            
            $("#recipe-directions").text(recipe.directions);   
        }
    }

    exports.RecipePane = RecipePane;
})(window)