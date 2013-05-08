$(function(){  

    // dietary restriction toggle
    $('.drBtn button:not(#custom)').click(function(){
        $(this).toggleClass("btn-success");
    });


    // click / enter handler for adding custom items
    function addCustomItem(input) {
        if(typeof input != "string") {
            var input = $('#allergies').val();
        }

        if(input.trim().length > 0) {
            $("<div><span class='custom-restriction'>" + input + "</span><button class='btn btn-danger btn-mini'><i class='icon-minus icon-white'></i></button></div>")
                .insertAfter("#add")
                .find("button").click(function(){
                    $(this).parent().remove();
                });
        }

        $('#allergies').val("");
        $("#allergies").focus();
    }

    
    $("#add").click(addCustomItem);
    $("#allergies").keypress(function(e){
        if (e.which == 13){
            addCustomItem();
        }
    });

    // handlers for updating whether custom is selected
    function updateCustomHighlight() {
        if(($('#allergies').val().trim().length > 0) ||
           ($('.custom-restriction').length > 0)) {

            $("#custom").addClass("btn-success");
        }
        else {
            $("#custom").removeClass("btn-success");
        }
    }

    $("#allergies").keyup(updateCustomHighlight);
    $("#customContainer").click("button", updateCustomHighlight);


    // show/hide custom container
    function toggleCustomContainer() {
        if($("#customContainer").hasClass("shown")) {
            $("#customContainer").animate({'left': '630px'})
                                 .removeClass("shown");
        }
        else {
            $("#customContainer").animate({'left': '855px'})
                                 .addClass("shown");

            $("#allergies").focus();
        }
    }

    
    $("#custom").click(toggleCustomContainer);

    
    // submission
    $("#search-form").submit(function(evt) {
        evt.preventDefault();

        custom = [];
        $('.custom-restriction').each(function(idx, el) {
            custom.push($(el).text().trim());
        })
        if($('#allergies').val().trim().length > 0) {
            custom.push($('#allergies').val().trim());
        }

        // build params
        var params = {
            vegan: $('#vegan').hasClass("btn-success"),
            vegetarian: $('#vegetarian').hasClass("btn-success"),
            gf: $('#gluten-free').hasClass("btn-success"),
            lf: $('#lactose-free').hasClass("btn-success"),
            custom: custom,
            query: $('#query').val()
        }

        $.cookie("vegitude-saved", JSON.stringify(params));

        window.location = "results.html?" + $.param(params);

        return false;
    });

    // restore saved restrictions
    var savedRestrictions = $.cookie("vegitude-saved");
    if(savedRestrictions) {
        savedRestrictions = JSON.parse(savedRestrictions);
        if(savedRestrictions.vegan) {
            $('#vegan').addClass("btn-success");
        }
        if(savedRestrictions.vegetarian) {
            $('#vegetarian').addClass("btn-success");
        }
        if(savedRestrictions.gf) {
            $('#gluten-free').addClass("btn-success");
        }
        if(savedRestrictions.lf) {
            $('#lactose-free').addClass("btn-success");
        }
        if(savedRestrictions.custom.length > 0) {
            $("#custom").addClass("btn-success");
            toggleCustomContainer();
            savedRestrictions.custom.reverse().forEach(function(item) {
                addCustomItem(item);
            });
        }
    }

    // apply query from url
    var urlQuery = $.url().param("query");
    if(urlQuery) {
        $("#query").val(urlQuery).select();
    }

    // add autocomplete

    $.get('data/autocomplete.json', function(json) {
        $('#allergies').typeahead({
            source: json
        });
    });
});
