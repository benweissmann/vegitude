(function(exports) {
    "use strict";

    // creates the contents of a div that contains the name, time, and difficulty of a search result
    // name is the title of the recipe
    function createResult(recipe) {
        return "<div class=\"result\"><h4>"+ recipe.name + "</h4></div>";
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

    $(function() {
        var params = $.url().param();

        // pre-fill search boxes with current query
        $('.mini-search .search-query').val(params.query);

        // and make the search button work
        $('.mini-search').submit(function() {
            params.query = $(this).find('.search-query').val()
            window.location = "results.html?" + $.param(params);
            return false;
        })

        // populate restriction display
        var restrictions = [];
        if(params.vegan == "true") {
            restrictions.push("Vegan");
        }
        else if(params.vegetarian == "true") {
            restrictions.push("Vegetarian");
        }
        else if(params.gf == "true") {
            restrictions.push("Gluten-Free");
        }
        else if(params.lf == "true") {
            restrictions.push("Lactose-Free");
        }

        if(params.custom) {
            params.custom.forEach(function(ingred) {
                restrictions.push("No " + ingred);
            })
        }


        var restString;
        if(restrictions.length == 0) {
            restString = "No restrictions."
        }
        else {
            restString = "Restrictions: " + restrictions.join(", ") + ".";
        }

        $("#restrictions-list").text(restString);

        // make change restrictions link preserve query
        $('a.link-back').attr("href", "index.html?query=" + params.query);
    });

    exports.ResultsPane = ResultsPane;
})(window);