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

    $('#experience').on('click', '.more a', function (e) {
        e.preventDefault();
        var $this = $(this),
            $experience = $this.parents('.experience').parent(),
            $currentTeaser,
            $newTeaser,
            currentImage = $experience.find('img').attr('src'),
            newImage;

        if ($this.text() === 'More') {
            // make the full width
            $experience.addClass('g4').removeClass('g1');

            // direct top of browser to that location

            // change more link to less
            $this.text('Less');

            // change paragraph to header
            $currentTeaser = $experience.find('p:first');
            $newTeaser = $('<h4></h4>').append($currentTeaser.text());
            $currentTeaser.replaceWith($newTeaser);

            // display bullets
            $this.parent().siblings('.details').show();

            // switch image thumbnail
            newImage = currentImage.replace('_small.jpg', '.png');
            $experience.find('img').attr('src', newImage);

        } else {

            // make the full width
            $experience.addClass('g1').removeClass('g4');

            // direct top of browser to that location

            // change less link to more
            $this.text('More');

            // change paragraph to header
            $currentTeaser = $experience.find('h4');
            $newTeaser = $('<p></p>').append($currentTeaser.text());
            $currentTeaser.replaceWith($newTeaser);

            // display bullets
            $this.parent().siblings('.details').hide();

            // switch image thumbnail
            newImage = currentImage.replace('.png', '_large.jpg');
            $experience.find('img').attr('src', newImage);

        }

        // move to the top
        $.scrollTo($experience, { offset: -10 });

    });

});
