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
        var $this = $(this);
        $this.parent().siblings('.details').toggle();
        $this.text($this.text() === 'More' ? 'Less' : 'More');
    });

});



