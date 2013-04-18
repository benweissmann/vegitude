window.onload = function(){  

    var customCounter = 0;
    var customList = new Array();

    $('.btn').click(function(){
        console.log("hello");

        if($(this).closest('div').attr('id')=="drBtn"){
            if($(this).attr('class')=="btn-success"){
                $(this).removeClass("btn-success").addClass("btn");
            }
            else{
                $(this).removeClass("btn").addClass("btn-success");
            }
        }

        else{
            if($(this).attr('id')=="add"){
                var input = $('input[id=allergies]').val();
                $("<div id='allergy"+customCounter+"'><span id='"+customCounter+"'>"+input+"</span><button id='"+customCounter+"'class='btn btn-danger'><i class='icon-minus icon-white'></i></button></div>")
                    .insertAfter("#add");
                
                $("#"+customCounter).click(function(){
                    $(this).parent().remove();
                });
                customList[customCounter] = input;
                customCounter++;
                console.log(customList);
            }
            else{
                console.log("yoyoyo");
                $(this).parent().remove();
            }
        }

        if($(this).attr('id')=="Custom"){
            console.log("yo");

            $("#customContainer").slideToggle("slow");
        }


    });


    /*
    veganButton.onclick = function(){
        if(activeButtons[0]){
            veganButton.style.borderColor = "#ccc";
            veganButton.style.borderWidth = "1px";
            activeButtons[0] = false;
        }
        else{
            veganButton.style.borderColor = "#80d966";
            veganButton.style.borderWidth = "medium";

            activeButtons[0] = true;
        }
    };

    veggieButton.onclick = function(){
        console.log("yoyo");
        if(activeButtons[1]){
            veggieButton.style.borderColor = "#ccc";
            veggieButton.style.borderWidth = "1px";
            activeButtons[1] = false;
        }
        else{
            veggieButton.style.borderColor = "#80d966";
            veggieButton.style.borderWidth = "medium";
            activeButtons[1] = true;
        }
    };

    glutenButton.onclick = function(){
        if(activeButtons[2]){
            glutenButton.style.borderColor = "#ccc";
            glutenButton.style.borderWidth = "1px";
            activeButtons[2] = false;
        }
        else{
            glutenButton.style.borderColor = "#80d966";
            glutenButton.style.borderWidth = "medium";
            activeButtons[2] = true;
        }
    };

    lactoseButton.onclick = function(){
        if(activeButtons[3]){
            lactoseButton.style.borderColor = "#ccc";
            lactoseButton.style.borderWidth = "1px";
            activeButtons[3] = false;
        }
        else{
            lactoseButton.style.borderColor = "#80d966";
            lactoseButton.style.borderWidth = "medium";
            activeButtons[3] = true;
        }
    };

    customButton.onclick = function(){
        if(activeButtons[4]){
            customButton.style.borderColor = "#ccc";
            customButton.style.borderWidth = "1px";
            activeButtons[4] = false;
        }
        else{
            customButton.style.borderColor = "#80d966";
            customButton.style.borderWidth = "medium";
            activeButtons[4] = true;
        }
    };
    */
}
