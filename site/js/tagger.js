$(function() {
    $('.table').fixedHeader({topOffset: 0});

    var selectedRow = 0;

    var numRows = $('table tbody tr').length;

    function updateRow() {
        selected = $('table tbody tr').removeClass('selected')
                                      .eq(selectedRow)
                                          .addClass('selected');
    }

    function check(n) {
        $('table tbody tr').eq(selectedRow)
                           .find('input')
                           .eq(n)
                           .click();
    }

    function scroll(n) {
        $(document.body).scrollTop($(document.body).scrollTop() + n);
    }

    $(document.body).keydown(function(e) {
        console.log(e.which);
        if(e.which == 38) {
            // up
            if(selectedRow > 0) {
                selectedRow--;
            }
            scroll(-37);
        }
        else if(e.which == 40) {
            // down
            if(selectedRow < (numRows-1)) {
                selectedRow++;
            }
            scroll(37);
        }
        else if((e.which <= 53) && (e.which >= 49)) {
            // 1-5
            check(e.which - 49);
        }
        else {
            return;
        }
        updateRow();
        e.stopPropagation();
        return false;
    });

    updateRow()

});