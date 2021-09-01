/*
 * Replace all SVG images with inline SVG
 * Ref : https://www.it-mure.jp.net/ja/css/%E5%A1%97%E3%82%8A%E3%81%A4%E3%81%B6%E3%81%97%E3%81%AE%E8%89%B2%E3%82%92%E5%A4%89%E6%9B%B4%E3%81%99%E3%82%8Bimg-src-svg/1048655414/
 */

function inlineSvg(svgquery, fillcolor, imgsrc){
console.log(`${svgquery}, ${fillcolor}, ${imgsrc}`);

$(svgquery).each(function(){
    var $img = $(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = imgsrc ;//? imgsrc : $img.attr('src');

    $.get(imgURL, function(data) {
        // Get the SVG tag, ignore the rest
        var $svg = $(data).find('svg');

        // Add replaced image's ID to the new SVG
        if(typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if(typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass+' replaced-svg');
        }
        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Layout settings
        $svg = $svg.attr('style', 'width: 100%; height: 100%; opacity: 1;');
        $svg.find('path').removeAttr('style');
        $svg.find(".st0").css({'fill': fillcolor});

        // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
        if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
            $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
        }
        // Replace image with new SVG
        $img.replaceWith($svg);

    }, 'xml');
});
}