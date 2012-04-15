// page doesn't respond correctly when device rotated on iPhone and iPad
// http://css-tricks.com/forums/discussion/15236/solved-ipad-zoom-problems
if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
  var viewportmeta = document.querySelector('meta[name="viewport"]');
  if (viewportmeta) {
    viewportmeta.content = 'maximum-scale=1';
    // shen someone touches it, let them scale it
    document.body.addEventListener('gesturestart', function () {
      viewportmeta.content = 'width=980, minimum-scale=0.25, maximum-scale=1.6';
    }, false);
  }
}

$(window).load(function() {
  /* figure out the container and heading widths then set the line widths as remaining width */
  /* need to do this on window load so fonts can download and the correct h3 width is returned */
  $('.separator').each(function() {
    var $this = $(this);

    /* get the widths of the container and heading text */
    var thisWidthPx = $this.css('width').replace('px', '');
    var h3WidthPx = $this.find('h3').css('width').replace('px', '');

    /* convert the widths to percent to be responsive */
    var thisWidthPercent = 100;
    var h3WidthPercent = (h3WidthPx / thisWidthPx) * 100;

    /* calculate the line width as the remaining space available */
    var lineMarginsPercent = $this.find('.line').css('margin-left').replace('%', '') * 2;
    /* need to subtract 4% so lines don't wrap onto the next line, unsure why though */
    var lineWidthPercent = (thisWidthPercent - h3WidthPercent - lineMarginsPercent) / 2 - 4;

    /* set the line width then show them so they don't resize abruptly */
    $this.find('.line').css({'width': lineWidthPercent + '%', 'opacity': 1});
  });
});
