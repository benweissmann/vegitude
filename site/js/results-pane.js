(function(exports) {

    // creates the contents of a div that contains the name, time, and difficulty of a search result
    // name is the title of the recipe
    function createResult(recipe) {
        var div_string = "<div class=\"result\"><h4>"+ recipe.name + "</h4><ul><li>";
        div_string = div_string + "time: " + recipe.time +"</li><li>servings: " + recipe.servings +"</li></ul></div>";
        return div_string;
    }

    var ResultsPane = {
        // displays the results
        render: function(data) {
            // loops through the results making a div for each one
            data.forEach(function(recipe) {
                var new_div = $(createResult(recipe));

                new_div.click(function() {  
                    RecipePane.display(recipe);
                });

                $("#results").append(new_div);  
            });

            // toggle active class when clicked
            $(".result").click(function() {
                $(".result").removeClass("active");
                $(this).addClass("active");
            });

            // select first result
            $(".result:first-child").addClass("active");
        }
    }

    exports.ResultsPane = ResultsPane;
})(window);