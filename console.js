// node terminal output

'use strict'

var chalk = require('chalk')
var termSize = require('term-size')
var termImg = require('term-img')
var u8 = require('to-uint8')
var encode = require('image-encode')

module.exports = function toConsole(pixels, o) {
	return termImg(Buffer.from(encode(pixels, 'png', o)), {
		width: '100%',
		height: '100%',
		fallback: function () { toConsoleOldschool(pixels, o) }
	})
}
module.exports.stdout = process.stdout

// adapted from https://github.com/sindresorhus/terminal-image/blob/master/index.js
var PIXEL = '\u2584';

function toConsoleOldschool (pixels, o) {
	pixels = u8(pixels)
	var size = termSize()
	var cols = Math.min(o.width, size.columns - 2)
	var ratio = o.width / o.height
	var dx = o.width / cols
    var dy = dx

	var str = ''
    for (var y = 0; y < o.height; y += dy) {
        for (var x = 0; x < o.width; x += dx) {
            var i = (Math.floor(y) * o.width + Math.floor(x)) * 4
            var r = pixels[i]
            var g = pixels[i + 1]
            var b = pixels[i + 2]
            var a = pixels[i + 3]
            var i2 = (Math.floor(y + 1) * o.width + Math.floor(x)) * 4
            var r2 = pixels[i]
            var g2 = pixels[i + 1]
            var b2 = pixels[i + 2]
            if (!a) str += chalk.reset(' ')
            else str += chalk.bgRgb(r, g, b).rgb(r2, g2, b2)(PIXEL)
        }
    	str += '\n'
    }

    process.stdout.write(str)
}
