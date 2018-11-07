// save pixel data into a file
'use strict'

var saveFile = require('save-file')
var imageType = require('image-type')
var encode = require('./encode')
var loadSource = require('image-pixels')

module.exports = function savePixels (data, dst, o) {
	if (!dst) throw Error('Destination must be an object or string')

	if (!o) o = {}

	// TODO: add shortcuts here for encoded png → png, array → array, canvas → canvas saves

	return loadSource(data, o).then(function (data) {
		if (typeof dst === 'string') {
			return saveFile(encode(data.data, {
				width: data.width,
				height: data.height,
				quality: o.quality || 1
			}), dst)
		}

		// canvas2d
		if (dst.getContext) dst = dst.getContext('2d')
		if (!dst) throw Error('Only Canvas2D context is supported')

		if (dst.canvas) {
			var ctx = dst

			ctx.canvas.width = data.width
			ctx.canvas.height = data.height
			var idata = ctx.createImageData(data.width, data.height)
			idata.data.set(data)
			ctx.putImageData(idata, 0, 0)

			return Promise.resolve(dst)
		}

		// array-ish
		if (dst.length != null) {
			for (let i = 0; i < data.length; i++) {
				dst[i] = data[i]
			}

			return Promise.resolve(dst)
		}

		// object
		dst.data = data

		return dst
	})
}
