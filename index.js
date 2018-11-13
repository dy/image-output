// save pixel data into a file
'use strict'

var saveFile = require('save-file')
var encode = require('image-encode')
var u8 = require('to-uint8')
var isFloat = require('is-float-array')
var ext = require('get-ext')
var toConsole = require('./console')

module.exports = function output (data, dst, o) {
	if (!dst) dst = console

	if (typeof o === 'string') o = {mime: o}
	else if (!o) o = {}

	// TODO: add shortcuts here for encoded png → png, array → array, canvas → canvas saves

	// figure out width/height
	if (o.shape) o.width = o.shape[0], o.height = o.shape[1]
	if (!o.width) o.width = data.shape ? data.shape[0] : data.width
	if (!o.height) o.height = data.shape ? data.shape[1] : data.height
	if (!o.width || !o.height) throw new Error('Options must define `width` and `height`')

	var pixels = u8(data)
	o.type = o.type || o.mime || o.mimeType || o.format
	o.quality = o.quality || 1

	// save to a file
	if (typeof dst === 'string') {

		if (!o.type) {
			o.type = types[ext(dst)] || types.png
		}

		return saveFile(encode(pixels, o), dst)
	}

	// console, stdout
	if (dst === toConsole.stdout || dst === console) {
		return toConsole(pixels, o)
	}

	// canvas2d, context
	if (dst.getContext) {
		dst = dst.getContext('2d')
		if (!dst) throw Error('Only Canvas2D context is supported')
	}
	if (dst.canvas) {
		var ctx = dst

		ctx.canvas.width = o.width
		ctx.canvas.height = o.height
		var idata = ctx.createImageData(o.width, o.height)
		idata.data.set(pixels)
		ctx.putImageData(idata, 0, 0)

		return Promise.resolve(idata)
	}

	// Stream

	// function

	// ImageData

	// Buffer, ArrayBuffer

	// Object
	// if (dst instanceof ArrayBuffer) {
	// 	return output(data, new Uint8Array(dst), o).then(function (dst) {
	// 		return dst.buffer
	// 	})
	// }

	// Array, TypedArray
	if (dst.length != null) {
		if (isFloat(dst)) {
			for (let i = 0; i < pixels.length; i++) {
				dst[i] = pixels[i] / 255
			}
		}
		else {
			dst.set(pixels)
		}

		return Promise.resolve(dst)
	}

	// ndarray
	if (isNdarray(dst)) {
		var i = 0
		for (var x = 0; x < o.width; x++) {
			for (var y = 0; y < o.height; y++) {
				dst.set(x, y, 0, pixels[i++])
				dst.set(x, y, 1, pixels[i++])
				dst.set(x, y, 2, pixels[i++])
				dst.set(x, y, 3, pixels[i++])
			}
		}
		return Promise.resolve(dst)
	}
}

function isNdarray(v) {
	return v &&
	    v.shape &&
	    v.stride &&
	    v.offset != null &&
	    v.dtype
}

var types = {
	'png': 'image/png',
	'image/png': 'image/png',
	'gif': 'image/gif',
	'image/gif': 'image/gif',
	'image/jpeg': 'image/jpeg',
	'image/jpg': 'image/jpeg',
	'jpg': 'image/jpeg',
	'jpeg': 'image/jpeg',
	'bmp': 'image/bmp',
	'image/bmp': 'image/bmp',
	'image/bitmap': 'image/bmp',
	'tiff': 'image/tiff',
	'tif': 'image/tiff',
	'exif': 'image/tiff',
	'image/tif': 'image/tiff',
	'image/tiff': 'image/tiff'
}
