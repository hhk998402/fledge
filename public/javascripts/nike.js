/**
 * Created by hemanthkumar on 01/04/18.
 */
$(document).ready(function() {

    //Open
    $('.button-modal').click(function() {
        $('.modal').addClass('is-open');
    });

    //Close
    $('.modal-close').click(function() {
        $('.modal').removeClass('is-open');
    });

    // Color
    $(".colors-list li").click(function(){
        $(this).addClass("color-selected").siblings(".colors-list li").removeClass("color-selected");
    });

    // Size
    $(".sizes-list li").click(function(){
        $(this).addClass("size-selected").siblings(".sizes-list li").removeClass("size-selected");
    });

    $( "#datepicker1" ).datepicker({
        changeYear:true,
        dateFormat:"dd-mm-yy",
        minDate: new Date()});
});


