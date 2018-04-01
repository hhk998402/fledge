/**
 * Created by hemanthkumar on 01/04/18.
 */
// Input Lock
$('textarea').blur(function () {
    $('#hire textarea').each(function () {
        $this = $(this);
        if ( this.value != '' ) {
            $this.addClass('focused');
            $('textarea + label + span').css({'opacity': 0});
        }
        else {
            $this.removeClass('focused');
            $('textarea + label + span').css({'opacity': 0});
        }
    });
});
//
$('#hire .field:first-child input').blur(function () {
    $('#hire .field:first-child input').each(function () {
        $this = $(this);
        if ( this.value != '' ) {
            $this.removeClass('focused');
            $('.field:first-child input + label + span').css({'opacity': 2});
        }
        else {
            $this.removeClass('focused');
            $('.field:first-child input + label + span').css({'opacity': 2});
        }
    });
});
//
$('#hire .field:nth-child(2) input').blur(function () {
    $('#hire .field:nth-child(2) input').each(function () {
        $this = $(this);
        if ( this.value != '' ) {
            $this.removeClass('focused');
            $('.field:nth-child(2) input + label + span').css({'opacity': 2});
        }
        else {
            $this.removeClass('focused');
            $('.field:nth-child(2) input + label + span').css({'opacity': 2});
        }
    });
});