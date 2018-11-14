// node terminal output

'use strict'

var chalk = require('chalk')
var termSize = require('term-size')
var termImg = require('term-img')
var u8 = require('to-uint8')
var encode = require('image-encode')

module.exports = toConsole

toConsole.stdout = process.stdout

function toConsole(pixels, o) {
    var data = encode(pixels, 'png', o)

    termImg(Buffer.from(data), {
        width: '100%',
        height: '100%',
        fallback: function () { toConsoleOldschool(pixels, o) }
    })

    return data
}

// adapted from terminal-image and picture-tube
var PIXEL = '\u2584';

function toConsoleOldschool (pixels, o) {
	pixels = u8(pixels)
	var size = termSize()
	var cols = Math.min(o.width, size.columns - 2)
	var dx = o.width / cols
    var dy = 2 * dx

	var str = ''

    // display 1-row data
    if (o.height === 1) {
        for (var x = 0; x < o.width; x += dx) {
            var i = Math.floor(x) * 4
            var r = pixels[i]
            var g = pixels[i + 1]
            var b = pixels[i + 2]
            var a = pixels[i + 3]
            if (!a) str += chalk.reset(' ')
            else str += chalk.rgb(r, g, b)(PIXEL)
        }
        str += '\n'
    }
    else {
        for (var y = 0; y < o.height - 1; y += dy) {
            for (var x = 0; x < o.width; x += dx) {
                var i = (Math.floor(y) * o.width + Math.floor(x)) * 4
                var r = pixels[i]
                var g = pixels[i + 1]
                var b = pixels[i + 2]
                var a = pixels[i + 3]
                var i2 = (Math.floor(y + 1) * o.width + Math.floor(x)) * 4
                var r2 = pixels[i2]
                var g2 = pixels[i2 + 1]
                var b2 = pixels[i2 + 2]
                if (!a) str += chalk.reset(' ')
                else str += chalk.bgRgb(r, g, b).rgb(r2, g2, b2)(PIXEL)
            }
        	str += '\n'
        }
    }

    toConsole.stdout.write(str)
}
