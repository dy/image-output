# image-output [![Build Status](https://travis-ci.org/dy/image-output.svg?branch=master)](https://travis-ci.org/dy/image-output) [![unstable](https://img.shields.io/badge/stability-unstable-green.svg)](http://github.com/badges/stability-badges)

Output image data to a destination: file, canvas, console, stdout, ImageData etc.

## Usage

[![$ npm install image-output](http://nodei.co/npm/image-output.png?mini=true)](http://npmjs.org/package/image-output)

```js
var output = require('image-output')

// create chess pattern png from raw pixels data
output({
	data: [0,0,0,1, 1,1,1,1, 1,1,1,1, 0,0,0,1],
	width: 2,
	height: 2
}, 'chess.png')
```

## API

### `output(source, destination?, shape|options?)`

Output pixel data `source` to a `destination` based on `options`. Undefined destination displays image to console/stdout. The operation is done in sync fashion. `destination` and `options` may come in the opposite order for conveniency.

```js
output([0,1,1,0], [2,2,1], 'a.png')
```

#### `source`

Shoud be an actual image data container, one of:

* _Canvas_, _Context2D_, _WebGLContext_
* _ImageData_ or _Object_ `{data: Uint8Array, width, height}`
* DataURL or base64 string
* _Image_, _Video_, _ImageBitmap_ with resolved data
* _Array_, _Array_ of _Arrays_, _Uint8Array_, _FloatArray_ with raw pixels
* _ArrayBuffer_, _Buffer_
* _Ndarray_

Handy for that purpose is [`image-pixels`](https://ghub.io/image-pixels):

```js
var pixels = require('image-pixels')
output(await pixels('image.png'), 'image-copy.png')
```

#### `destination`

Can be any image output destination:

Type | Meaning
---|---
_String_ | File to create or path, in node. If includes extension, mimeType is detected from it.
_Canvas2D_, _Context2D_ | Render pixel data into a canvas. Canvas is resized to fit the image data. To avoid resizing, use `options.clip` property.
`document`, _Element_ | Create a canvas with diff data in document or element.
`console` | Display image to console in browser or to terminal in node.
_Array_ / _FloatArray_ | Write pixel data normalized to [0..1] range to a float-enabled array.
_UintArray_ | Put pixel data to any unsigned int array.
_Buffer_ / _ArrayBuffer_ | Put pixel data into a buffer, possibly encoded into target format by `options.type`.
_Ndarray_ | Write pixel data into an [ndarray](https://ghub.io/ndarray).
_ImageData_ | Put data into _ImageData_ instance, browser only.
_Object_ | Create `data`, `width` and `height` properties on an object.
_Function_ | Call a function with _ImageData_ as argument.
_Stream_ | Send data to stream, eg. `process.stdout`.
_WebStream_ | TODO. Send data to stream, eg. `process.stdout`.

#### `options`

Property | Meaning
---|---
`type` / `mime` | Encode into target type, by default detected from file extension. By default `image/png`.
`quality` | Defines encoding quality, 0..1, optional. By default 1.
`...rest` | Rest of options is passed to encoder.
<!-- `clip` | Defile clipping area rectangle from the initial data to save. -->

## Customize color palette in terminal
You can choose color palette with flags or environment variable `FORCE_COLOR=0123`
```
node ./script.js --no-color
node ./script.js --color
node ./script.js --color=256
node ./script.js --color=16m
```

## Related

* [image-equal](https://ghub.io/image-equal) − compare if two images are equal.
* [image-pixels](https://ghub.io/image-pixels) − load image data from any source.
* [image-encode](https://ghub.io/image-encode) − encode image data into one of the target formats.

## Similar

* [save-pixels](https://ghub.io/save-pixels) − output ndarray with image pixels to a file.
* [terminal-image](https://ghub.io/terminal-image) − print image to a terminal.

## License

© 2018 Dmitry Yv. MIT License.
