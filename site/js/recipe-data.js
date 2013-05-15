(function(exports) {
    var URL = "/recipes"

    var RecipeData = {
        load: function(cb) {
            $.get(URL + window.location.search, function(json) {
                cb(JSON.parse(json));
            }).fail(function(data) {
                console.error(data);
                $("#loader").fadeOut(function() {
                    $("#load-error").fadeIn();
                });
            });
        }
    }

    // set up original / substituted buttons
    $(function() {
        RecipeData.load(function(data) {
            if(data.length > 0) {
                ResultsPane.render(data);
                RecipePane.display(data[0], true);
                $("#loader").fadeOut(function() {
                    $("#content").fadeIn();
                });
            }
            else {
                $("#loader").fadeOut(function() {
                    $("#no-results").fadeIn();
                });
            }
        })
    })

    exports.RecipeData = RecipeData;
})(window);