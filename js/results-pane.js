(function(exports) {

    // creates the contents of a div that contains the name, time, and difficulty of a search result
    // name is the title of the recipe, counter is to give the div an id with the correct counter
    function createResult(name, counter) {
        var recipe;
        if (name == "Tofu Pad Thai") {
            recipe = RECIPE_PANE_DATA[name];
        } else {
            recipe = MORE_RECIPE_PANE_DATA[name];
        }
        
        var div_string = "<div id=\"result" + counter + "\" class=\"result\"><h4>"+ name + "</h4><ul><li>";
        div_string = div_string + recipe.time +"</li><li>" + recipe.difficulty +"</li></ul></div>";
        return div_string;
    }

    var ResultsPane = {
        // displays the results
        display: function(search_results) {
            // loops through the results making a div for each one
            for(var i = 0; i < search_results.length; i++) {
                console.log(search_results[i]);
                var new_div = createResult(search_results[i], i);
                $("#recipe-results").append(new_div);
                if (i == 0) {
                    $("#result0").addClass("active");
                }
            }
        }
    }

    // sets up active/inactive result
    $(function() {
        $(".result").click(function() {
            $(".result").removeClass("active");
            $(this).addClass("active");
        });
    });

    exports.ResultsPane = ResultsPane;
})(window)