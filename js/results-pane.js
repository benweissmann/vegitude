(function(exports) {

    // creates the contents of a div that contains the name, time, and difficulty of a search result
    // name is the title of the recipe
    function createResult(name) {
        var recipe = RECIPE_PANE_DATA[name];
        
        var div_string = "<div class=\"result\"><h4>"+ name + "</h4><ul><li>";
        div_string = div_string + "time: " + recipe.time +"</li><li>difficulty: " + recipe.difficulty +"</li></ul></div>";
        return div_string;
    }

    var ResultsPane = {
        // displays the results
        display: function(search_results) {
            // loops through the results making a div for each one
            search_results.forEach(function(result) {
                var new_div = $(createResult(result));

                new_div.click(function() {  
                    RecipePane.display(result);
                });

                $("#results").append(new_div);  
            });
        }
    }

    // sets up active/inactive result
    $(function() {
        $(".result").click(function() {
            $(".result").removeClass("active");
            $(this).addClass("active");
        });

        // select first result
        $(".result:first-child").addClass("active");
    });

    exports.ResultsPane = ResultsPane;
})(window)