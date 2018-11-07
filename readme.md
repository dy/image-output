# image-save [![Build Status](https://travis-ci.org/dy/image-save.svg?branch=master)](https://travis-ci.org/dy/image-save) [![unstable](https://img.shields.io/badge/stability-unstable-green.svg)](http://github.com/badges/stability-badges)

Put image data to a file, canvas or an array.

## Usage

[![$ npm install image-save](http://nodei.co/npm/image-save.png?mini=true)](http://npmjs.org/package/image-save)

```js
var imsave = require('image-save')

await imsave({
	data: [0,0,0,1, 1,1,1,1, 1,1,1,1, 0,0,0,1],
	width: 2,
	height: 2
}, 'chess.png')
```

## API

### `await save(data, destination, options?)`

Save pixel `data` into `destination` object, possibly based on `options`.

#### `data`

Can be any image data or image source:

* Array, TypedArray
* Image, ImageData, ImageBitmat
* ndarray
* Canvas, Context2D, WebGLContext
* dataURL / base64 string
* URL, path
* File, Blob
* ArrayBuffer, Buffer
* Buffer
* etc..

For the full list of sources see [image-pixels](https://ghub.io/image-pixels).
Buffer with raw pixel data will be encoded into target format, detected from filename extension.

#### `destination`

Type | Meaning
---|---
filename | A file to create. Can include extension to define encoding. In node can be a path.
Canvas2D | Render pixel data into a defined canvas. Only 2D canvas is supported.
ndarray | Put pixel data into an ndarray.
Array / FloatArray | Put pixel data with [0..1] range into a float array.
TypedArray | Put pixel data with [0..255] range into a uint array.
Buffer / ArrayBuffer | Put pixel data into a buffer.

```js
var equal = require('image-equal')
var save = require('image-save')

var diff = {}

// display image difference if two images are not equal
if (!equal('./a.jpg', './b.jpg', diff)) {
	save(diff, './ab-diff.jpg')
}
```

#### `options`

Property | Meaning
---|---
`clip` | Defile clipping area rectangle from the initial data to save.
`width` | Defines width of raw pixel data.
`height` | Defines height of raw pixel data.
`type` / `mime` | Defines encoding mime type, optional.
`quality` | Defines encoding quality, optional.


## Related packages

* [image-equal](https://ghub.io/image-equal) − compare if two images are equal.
* [image-pixels](https://ghub.io/image-pixels) − load image data from any source.

## License

© 2018 Dmitry Yv. MIT License.
