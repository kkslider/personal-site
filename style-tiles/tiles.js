/* jQuery css for background color returns RGB, convert it to hex
credit: http://stackoverflow.com/questions/638948/background-color-hex-to-javascript-variable-jquery */
function rgbToHex(rgbString) {
  var parts = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  delete (parts[0]);
  for (var i = 1; i <= 3; ++i) {
    parts[i] = parseInt(parts[i], 10).toString(16);
    if (parts[i].length == 1) parts[i] = '0' + parts[i];
  }
  return '#'+parts.join('').toUpperCase();
}

$(document).ready(function() {
  var i;
  for (i = 1; i <= 6; i++) {
    var rgbString = rgbToHex($('div.color-' + i).css('background-color'));
    $('span.color-' + i).text(rgbString).css('color', rgbString);
  }
  for (i = 1; i <= 4; i++) {
    var backgroundURL = $('div.pattern-' + i).css('background-image');
    backgroundURL = backgroundURL.replace('url(', '').replace(')', '').replace('none', '');
    $('span.pattern-' + i).text(backgroundURL);
  }
  for (i = 1; i <= 4; i++) {
    var $element = i < 4 ? $('h' + i) : $('p');
    var fontWeight = $element.css('font-weight');
    var fontSize = $element.css('font-size');
    var fontFamily = $element.css('font-family');
    var font = fontWeight + ' ' + fontSize + ' ' + fontFamily;
    console.log(font);
    $('.font-' + i).text(font);
  }
  $('footer').hide();
  $('#details').on('click', function() {
    $('footer').toggle();
    var text = $(this).text();
    $(this).text(text == 'show details' ? 'hide details' : 'show details');
  });
});
