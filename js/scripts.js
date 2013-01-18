/*jslint browser: true*/
/*global $, jQuery, Mustache, navigator, console*/

// page doesn't respond correctly when device rotated on iPhone and iPad
// http://css-tricks.com/forums/discussion/15236/solved-ipad-zoom-problems
if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
    var viewportmeta = document.querySelector('meta[name="viewport"]');
    if (viewportmeta) {
        viewportmeta.content = 'maximum-scale=1';
        // when someone touches it, let them scale it
        document.body.addEventListener('gesturestart', function () {
            'use strict';
            viewportmeta.content = 'width=980, minimum-scale=0.25, maximum-scale=1.6';
        }, false);
    }
}

$(document).ready(function () {
    'use strict';

    $('#experience').on('click', '.g1 .experience', function (e) {
        e.preventDefault();
        $('.experience').removeClass('viewing');
        var $this = $(this),
            $experience = $this.parents('.g1'),
            $experienceLarge = $experience.clone(true),
            $separator = $experience.prevAll('.separator:first'),
            $currentTeaser,
            $newTeaser,
            currentImage = $experience.find('img').attr('src'),
            newImage;

        // make the full width
        $experienceLarge.addClass('g4').removeClass('g1');

        // change paragraph to header
        $currentTeaser = $experienceLarge.find('p:first');
        $newTeaser = $('<h4></h4>').append($currentTeaser.text());
        $currentTeaser.replaceWith($newTeaser);

        // display bullets
        $experienceLarge.find('.details').show();

        // switch image thumbnail
        newImage = currentImage.replace('_small.jpg', '.png');
        $experienceLarge.find('img').attr('src', newImage);

        // set class on only this one to show it is being viewed
        $experience.children('.experience').addClass('viewing');

        // insert the new one and delete any open ones
        $('#experience .g4 .experience').remove();
        $separator.after($experienceLarge);

        // move to the top
        $.scrollTo($experienceLarge, { offset: -10 });
    });

    $('#experience').on('click', '.g4 .experience', function (e) {
        e.preventDefault();
        $(this).parents('.g4').remove();
        $('#experience .experience').removeClass('viewing');
    });

});
