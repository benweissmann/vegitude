$(function(){  

    var customCounter = 0;

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

        $("<div><span>" + input + "</span><button class='btn btn-danger btn-mini'><i class='icon-minus icon-white'></i></button></div>")
            .insertAfter("#add")
            .find("button").click(function(){
                $(this).parent().remove();
            });

        $('#allergies').val("");
        $("#allergies").focus();
    }

    $("#add").click(addCustomItem);
    $("#allergies").keypress(function(e){
        if (e.which == 13){
            addCustomItem();
        }
    });

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
});
