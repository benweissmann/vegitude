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
        var input = $('input[id=allergies]').val();

        $("<div><span>" + input + "</span><button class='btn btn-danger'><i class='icon-minus icon-white'></i></button></div>")
            .insertAfter("#add")
            .find("button").click(function(){
                $(this).parent().remove();
            });

        $('input[id=allergies]').val("");
    }

    $("#add").click(addCustomItem);
    $("#allergies").keypress(function(e){
        if (e.which == 13){
            addCustomItem();
        }
    });

    $("#custom").click(function() {
        $("#customContainer").slideToggle("slow");
    });
});
