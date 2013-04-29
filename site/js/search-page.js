$(function(){  

    // dietary restriction toggle
    $('.drBtn button').click(function(){
        if($(this).attr('class')=="btn-success"){
            $(this).removeClass("btn-success").addClass("btn");
        }
        else{
            $(this).removeClass("btn").addClass("btn-success");
        }
    });


    function addCustomItem() {
        var input = $('#allergies').val();

        $("<div><span class='custom-restriction'>" + input + "</span><button class='btn btn-danger btn-mini'><i class='icon-minus icon-white'></i></button></div>")
            .insertAfter("#add")
            .find("button").click(function(){
                $(this).parent().remove();
            });

        $('#allergies').val("");
        $("#allergies").focus();
    }

    // click / enter handler for adding custom items
    $("#add").click(addCustomItem);
    $("#allergies").keypress(function(e){
        if (e.which == 13){
            addCustomItem();
        }
    });

    // show/hide custom container
    $("#custom").click(function() {
        if($("#customContainer").hasClass("shown")) {
            $("#customContainer").animate({'left': '630px'})
                                 .removeClass("shown");
        }
        else {
            $("#customContainer").animate({'left': '855px'})
                                 .addClass("shown");

            $("#allergies").focus();
        }
    });

    
    // submission
    $("#search-form").submit(function(evt) {
        evt.preventDefault();

        custom = [];
        $('.custom-restriction').each(function(idx, el) {
            custom.push($(el).text());
        })

        // build params
        var params = {
            vegan: $('#vegan').hasClass("btn-success"),
            vegetarian: $('#vegetarian').hasClass("btn-success"),
            gf: $('#gluten-free').hasClass("btn-success"),
            lf: $('#lactose-free').hasClass("btn-success"),
            custom: custom,
            query: $('#query').val()
        }

        window.location = "results.html?" + $.param(params);

        return false;
    });
});
