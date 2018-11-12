# image-output [![Build Status](https://travis-ci.org/dy/image-output.svg?branch=master)](https://travis-ci.org/dy/image-output) [![unstable](https://img.shields.io/badge/stability-unstable-green.svg)](http://github.com/badges/stability-badges)

Output image data to a destination: file, canvas, console, stdout, ImageData etc.

## Usage

[![$ npm install image-output](http://nodei.co/npm/image-output.png?mini=true)](http://npmjs.org/package/image-output)

```js
var output = require('image-output')
var equal = require('image-equal')

// save image difference to a file
var diff = {}
if (!equal('./a.jpg', './b.jpg', diff)) {
	output(diff, './ab-diff.jpg')
}

// create chess pattern png from raw pixels data
output({
	data: [0,0,0,1, 1,1,1,1, 1,1,1,1, 0,0,0,1],
	width: 2,
	height: 2
}, 'chess.png')
```

## API

### `data = await output(source, destination=console, options?)`

Save pixel data `source` to a `destination` based on `options`. Undefined destination displays image to console/stdout.

#### `source`

Shoud be actual image data container, one of:

* ImageData
* Canvas, Context2D, WebGLContext
* dataURL/base64 string
* File, Blob
* Image
* Array, UintArray, FloatArray
* ArrayBuffer, Buffer
* ndarray
* Buffer
* File, Blob
* Promise
* Object `{data, width, height}`
* etc.

That is handy to load image data with [`image-pixels`](https://ghub.io/image-pixels) for that purpose:

```js
var pixels = require('image-pixels')

output(await pixels(Image), 'image-copy.png')
```

#### `destination`

Can be any image output destination:

Type | Meaning
---|---
String | File to create or path, in node. Can include extension to define encoding.
Canvas2D | Render pixel data into a defined canvas. Canvas is resized to fit the image data.
console | Display image data in console.
ndarray | Put pixel data into an ndarray.
Array / FloatArray | Put pixel data with [0..1] range into a float array.
TypedArray | Put pixel data with [0..255] range into an uint array.
Buffer / ArrayBuffer | Put pixel data into a buffer, possibly encoded into target type.
ImageData | Put data into ImageData instance.
Object | Creates `data`, `width` and `height` properties on an object.
Function | Getting called with the data.
Stream | Prints data to stream, eg. `stdout`.

#### `options`

Property | Meaning
---|---
`clip` | Defile clipping area rectangle from the initial data to save. Can be
`type` / `mime` | Encode into target type, by default detected from file extension. By default `image/png`.
`quality` | Defines encoding quality, 0..1, optional. By default 1.
...rest | Rest of options is passed to encoder.

## Related

* [image-equal](https://ghub.io/image-equal) − compare if two images are equal.
* [image-pixels](https://ghub.io/image-pixels) − load image data from any source.
* [image-encode](https://ghub.io/image-encode) − encode image data into one of the target formats.

## Similar

* [save-pixels](https://ghub.io/save-pixels) − output ndarray with image pixels to a file.

## License

© 2018 Dmitry Yv. MIT License.
