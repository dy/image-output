'use strict'

var context, canvas

module.exports = function (data, o) {
	if (!context) {
		canvas = document.createElement('canvas')
		context = canvas.getContext('2d')
	}

	canvas.width = o.width
	canvas.height = o.height
	var idata = context.createImageData(canvas.width, canvas.height)
	idata.data.set(data)
	context.putImageData(idata, 0, 0)
	return canvas.toDataURL(o.type)
}
