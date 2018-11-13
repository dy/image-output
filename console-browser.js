// print image to console in browser

'use strict'

var WeakMap = require('weak-map')
var context
var cache = new WeakMap

module.exports = toConsole
module.exports.stdout = console

function toConsole (pixels, o) {
	if (!context) context = document.createElement('canvas').getContext('2d')

	var pngURL
	if (cache.has(pixels)) {
		pngURL = cache.get(pixels)
	}
	else {
		context.canvas.width = o.width
		context.canvas.height = o.height
		var idata = context.createImageData(o.width, o.height)
		idata.data.set(pixels)
		context.putImageData(idata, 0, 0)
		pngURL = context.canvas.toDataURL()
		cache.set(pixels, pngURL)
	}

	// FIXME: detect if console output is supported, otherwise generate a link
	console.log('%c+', [
      'font-size: 0;',
      'display: inline-block;',
   	  'line-height: 0;',
      'padding: ' + (o.height * .5) + 'px ' + (o.width * .5) + 'px;',
   	  'background:url(',
        pngURL.replace(/\(/g, '%28').replace(/\)/g, '%29'),
   	  ');',
   	  'background-size:' + o.width + 'px ' + o.height + 'px;',
      'color: transparent;'
	].join(''))

	return pngURL
}
