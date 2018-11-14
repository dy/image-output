// save pixel data into a file
'use strict'

var saveFile = require('save-file')
var encode = require('image-encode')
var pxls = require('pxls')
var isFloat = require('is-float-array')
var ext = require('get-ext')
var isBuffer = require('is-buffer')
var toConsole = require('./console')
var toab = require('to-array-buffer')
var isStream = require('is-stream')
var isBrowser = require('is-browser')
var isBlob = require('is-blob')
var isObj = require('is-plain-obj')

var context

module.exports = function output (data, dst, o) {
	if (!dst) dst = console

	if (isObj(dst) && o && !isObj(o)) {
		var t = dst
		dst = o
		o = t
	}

	if (typeof o === 'string') o = {mime: o}
	else if (Array.isArray(o)) o = {shape: o}
	else if (!o) o = {}

	// TODO: add shortcuts here for encoded png → png, array → array, canvas → canvas saves

	o.type = o.type || o.mime || o.mimeType || o.format || (typeof dst === 'string' && types[ext(dst)]) || types.png
	o.quality = o.quality || null

	// handle promise
	if (data.then) {
		return data.then(function (result) {
			return output(result, dst, o)
		})
	}

	// DOM load async shortcut, expects data to be loaded though
	if (isBrowser) {
		if (data instanceof File || isBlob(data) || data.tagName || data instanceof ImageBitmap) {
			if (!context) context = document.createElement('canvas').getContext('2d')
			context.canvas.width = imageBitmap.width
			context.canvas.height = imageBitmap.height

			context.drawImage(imageBitmap, 0, 0)

			return context.getImageData(0, 0, context.canvas.width, context.canvas.height)
		}
	}

	// figure out width/height
	if (o.shape) o.width = o.shape[0], o.height = o.shape[1]
	if (!o.width) o.width = data.shape ? data.shape[0] : data.width
	if (!o.height) o.height = data.shape ? data.shape[1] : data.height
	if (!o.width || !o.height) {
		throw new Error('Options must define `width` and `height`')
	}

	var pixels = pxls(data)

	// save to a file
	if (typeof dst === 'string') {
		return saveFile.sync(encode(pixels, o), dst)
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
		if (pixels) {
			var idata = ctx.createImageData(o.width, o.height)
			idata.data.set(pixels)
			ctx.putImageData(idata, 0, 0)
		}
		else {
			ctx.drawImage(data)
		}

		return idata
	}

	// Stream
	if (isStream(dst)) {
		if (!dst.write) throw Error('Only writable streams are supported')

		var data = encode(pixels, o)
		dst.write(Buffer.from(data))
		dst.on('error', function (e) {
			throw e
		})
		return data
	}

	// function
	if (typeof dst === 'function') {
		var data = {data: pixels, width: o.width, height: o.height}
		return dst(data) || data
	}

	// ArrayBuffer
	if (dst instanceof ArrayBuffer) {
		dst = new Uint8Array(dst)
	}

	// Array, TypedArray, Buffer
	if (dst.length != null) {
		if (isFloat(dst)) {
			for (let i = 0; i < pixels.length; i++) {
				dst[i] = pixels[i] / 255
			}
		}
		else {
			dst.set(pixels)
		}

		return dst
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
		return dst
	}

	// ImageData, rest of objects
	if (dst) {
		if (dst.width) {
			if (dst.width !== o.width) throw Error('Destination width ' + dst.width + ' is different from pixels width ' + o.width)
		}
		else dst.width = o.width
		if (dst.height) {
			if (dst.height !== o.height) throw Error('Destination height ' + dst.height + ' is different from pixels height ' + o.height)
		}
		else dst.height = o.height

		if (dst.data && dst.data.set) dst.data.set(pixels)
		else dst.data = pixels

		return dst
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
