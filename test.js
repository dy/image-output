'use strict'


var t = require('tape')
var output = require('./')
var fixture = require('./fixture')
var isBrowser = require('is-browser')
var load = require('image-pixels')
var del = require('del')
var NDArray = require('ndarray')
var getNdPixels = require('get-pixels')
var toab = require('to-array-buffer')
var lena = require('lena')


t('output to file', async t => {
  if (isBrowser) return t.end()

  t.plan(1)
  await output(fixture, 'file.png')
  let pixels = await load('file.png')

  t.deepEqual(pixels.data, fixture.data)

  del('./file.png')

  t.end()
})

t('output to canvas, context', async t => {
  // TODO: add node-canvas tests here
  if (!isBrowser) return t.end()

  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d')

  await output(fixture, canvas)
  var idata = context.getImageData(0, 0, canvas.width, canvas.height)
  t.deepEqual(idata.data, fixture.data)

  await output(fixture, context)
  var idata = context.getImageData(0, 0, canvas.width, canvas.height)
  t.deepEqual(idata.data, fixture.data)

  t.end()
})

t('output to array', async t => {
  var out = []

  await output(fixture, out)

  t.deepEqual(out, fixture.float)

  t.end()
})

t('output to uint array', async t => {
  var out = new Uint8Array(fixture.data.length)

  await output(fixture, out)

  t.deepEqual(out, fixture.data)
  t.end()
})

t('output to float array', async t => {
  var out = new Float64Array(fixture.data.length)

  await output(fixture, out)

  t.deepEqual(out, fixture.float)
  t.end()
})

t('output to ndarray', async t => {
  var out = new NDArray([], [fixture.width, fixture.height, 4])

  await output(fixture, out)

  getNdPixels(fixture.pngDataURL, (e, px) => {
    t.deepEqual(px.shape, out.shape)
    t.deepEqual(Array.from(px.data), Array.from(out.data))
    t.deepEqual(px.get(0,0,1), out.get(0,0,1))

    t.end()
  })
})

t('output to arraybuffer', async t => {
  var out = new Uint8Array(fixture.data.length)

  await output(fixture, out.buffer)

  t.deepEqual(out, fixture.data)
  t.end()
})

t('output to buffer', async t => {
  var out = new Buffer(fixture.data.length)

  await output(fixture, out)

  t.deepEqual(new Uint8Array(toab(out)), fixture.data)
  t.end()
})

t.only('output to console', async t => {
  await output(fixture, console)
  t.end()
})

t('output to default', async t => {

})

t('output to object', async t => {

})

t('output to ImageData', async t => {

})

t('output to function', async t => {

})

t('output to stdout', async t => {

})

t('output to Stream')

t('input File, Blob', async t => {

})

t('input Promise', async t => {

})


t('readme case', async t => {
  var arr = new Uint8Array(16)
  await output({
    data: [0,0,0,1, 1,1,1,1, 1,1,1,1, 0,0,0,1],
    width: 2,
    height: 2
  }, arr)

  t.deepEqual(arr, [0,0,0,255, 255,255,255,255, 255,255,255,255, 0,0,0,255])

  t.end()
})

t.skip('encode into jpg', async t => {
  var data = await output(fixture, {
    mime: 'jpeg'
  })
})

t('encode into png', async t => {

})





// save-pixels test cases
var zeros = require('ndarray-scratch').zeros
var ndarray = require('ndarray')
var savePixels = require('save-pixels')
var getPixels = require('get-pixels')
var fs = require('fs')

function writePixels(t, array, filepath, format, options, cb) {
  var out = fs.createWriteStream(filepath)
  var pxstream = savePixels(array, format, options)
  pxstream.pipe(out)
  .on('error', cb)
  .on('close', cb)
}

function compareImages(t, actualFilepath, expectedFilepath, deepEqual, cb) {
  getPixels(actualFilepath, function(err, actualPixels) {
    if(err) {
      t.assert(false, err)
      cb()
      return
    }

    getPixels(expectedFilepath, function(err, expectedPixels) {
      if(err) {
        t.assert(false, err)
        cb()
        return
      }

      if (deepEqual) {
        t.deepEqual(actualPixels, expectedPixels)
      } else {
        t.notDeepEqual(actualPixels, expectedPixels)
      }
      cb()
    })
  })
}
function assertImagesEqual(t, actualFilepath, expectedFilepath, cb) {
  compareImages(t, actualFilepath, expectedFilepath, true, cb)
}
function assertImagesNotEqual(t, actualFilepath, expectedFilepath, cb) {
  compareImages(t, actualFilepath, expectedFilepath, false, cb)
}

function testArray(t, array, filepath, format, cb) {
  writePixels(t, array, filepath, format, null, function(err) {
    if (err) {
      t.assert(false, err)
      cb()
      return
    }

    process.nextTick(function() {
      getPixels(filepath, function(err, data) {
        if(err) {
          t.assert(false, err)
          cb()
          return
        }

        var arrayWidth = array.shape.length <= 3 ? array.shape[0] : array.shape[1]
        var arrayHeight = array.shape.length <= 3 ? array.shape[1] : array.shape[2]
        var dataWidth = data.shape.length <= 3 ? data.shape[0] : data.shape[1]
        var dataHeight = data.shape.length <= 3 ? data.shape[1] : data.shape[2]
        t.equals(arrayWidth, dataWidth)
        t.equals(arrayHeight, dataHeight)

        if(array.shape.length === 2) {
          for(var i=0; i<array.shape[0]; ++i) {
            for(var j=0; j<array.shape[1]; ++j) {
              if(data.shape.length === 3) {
                t.equals(array.get(i,j), data.get(i,j,0))
              } else {
                t.equals(array.get(i,j), data.get(i,j))
              }
            }
          }
        } else if(array.shape.length === 3) {
          for(var i=0; i<array.shape[0]; ++i) {
            for(var j=0; j<array.shape[1]; ++j) {
              for(var k=0; k<array.shape[2]; ++k) {
                if(data.shape.length === 3) {
                  t.equals(array.get(i,j,k), data.get(i,j,k))
                } else {
                  t.equals(array.get(i,j,k), data.get(0,i,j,k))
                }
              }
            }
          }
        } else {
          for(var i=0; i<array.shape[0]; ++i) {
            for(var j=0; j<array.shape[1]; ++j) {
              for(var k=0; k<array.shape[2]; ++k) {
                for(var l=0; l<array.shape[3]; ++l) {
                  t.equals(array.get(i,j,k,l), data.get(i,j,k,l))
                }
              }
            }
          }
        }
        if (!process.env.TEST_DEBUG) {
          fs.unlinkSync(filepath)
        }
        cb()
      })
    })
  })
}


t('save-pixels saving a monoscale png', function(t) {
  var x = zeros([64, 64])

  for(var i=0; i<64; ++i) {
    for(var j=0; j<64; ++j) {
      x.set(i, j, i+2*j)
    }
  }
  testArray(t, x, 'temp.png', 'png', function() {
    t.end()
  })
})

t('save-pixels saving a RGB png', function(t) {
  var x = zeros([64, 64, 3])

  for(var i=0; i<64; ++i) {
    for(var j=0; j<64; ++j) {
      x.set(i, j, 0, i)
      x.set(i, j, 1, j)
      x.set(i, j, 2, i+2*j)
    }
  }
  testArray(t, x, 'temp.png', 'png', function() {
    t.end()
  })
})

t('save-pixels saving a RGB jpeg', function(t) {
  var x = zeros([64, 64, 3])
  var actualFilepath = 'temp.jpeg'
  var expectedFilepath = 'test/expected.jpeg'

  for(var i=0; i<64; ++i) {
    for(var j=0; j<64; ++j) {
      x.set(i, j, 0, i)
      x.set(i, j, 0, j)
      x.set(i, j, 0, i+2*j)
    }
  }
  writePixels(t, x, actualFilepath, 'jpeg', null, function(err) {
    if(err) {
      t.assert(false, err)
      t.end()
      return
    }

    assertImagesEqual(t, actualFilepath, expectedFilepath, function() {
      if (!process.env.TEST_DEBUG) {
        fs.unlinkSync(actualFilepath)
      }

      t.end()
    })
  })
})

t('save-pixels saving an unanimated gif', function(t) {
  var x = zeros([64, 64, 4])

  for(var i=0; i<32; ++i) {
    for(var j=0; j<32; ++j) {
      x.set(i, j, 0, 0)
      x.set(i, j, 1, 0)
      x.set(i, j, 2, 0)
      x.set(i, j, 3, 255)
      x.set(i+32, j, 0, 255)
      x.set(i+32, j, 1, 255)
      x.set(i+32, j, 2, 255)
      x.set(i+32, j, 3, 255)
      x.set(i, j+32, 0, 255)
      x.set(i, j+32, 1, 255)
      x.set(i, j+32, 2, 255)
      x.set(i, j+32, 3, 255)
      x.set(i+32, j+32, 0, 0)
      x.set(i+32, j+32, 1, 0)
      x.set(i+32, j+32, 2, 0)
      x.set(i+32, j+32, 3, 255)
    }
  }
  testArray(t, x, 'temp.gif', 'gif', function() {
    t.end()
  })
})

t('save-pixels saving an animated gif', function(t) {
  var x = zeros([2, 64, 64, 4])

  for(var i=0; i<32; ++i) {
    for(var j=0; j<32; ++j) {
      x.set(0, i, j, 0, 0)
      x.set(0, i, j, 1, 0)
      x.set(0, i, j, 2, 0)
      x.set(0, i, j, 3, 255)
      x.set(0, i+32, j, 0, 255)
      x.set(0, i+32, j, 1, 255)
      x.set(0, i+32, j, 2, 255)
      x.set(0, i+32, j, 3, 255)
      x.set(0, i, j+32, 0, 255)
      x.set(0, i, j+32, 1, 255)
      x.set(0, i, j+32, 2, 255)
      x.set(0, i, j+32, 3, 255)
      x.set(0, i+32, j+32, 0, 0)
      x.set(0, i+32, j+32, 1, 0)
      x.set(0, i+32, j+32, 2, 0)
      x.set(0, i+32, j+32, 3, 255)

      x.set(1, i, j, 0, 255)
      x.set(1, i, j, 1, 255)
      x.set(1, i, j, 2, 255)
      x.set(1, i, j, 3, 255)
      x.set(1, i+32, j, 0, 0)
      x.set(1, i+32, j, 1, 0)
      x.set(1, i+32, j, 2, 0)
      x.set(1, i+32, j, 3, 255)
      x.set(1, i, j+32, 0, 0)
      x.set(1, i, j+32, 1, 0)
      x.set(1, i, j+32, 2, 0)
      x.set(1, i, j+32, 3, 255)
      x.set(1, i+32, j+32, 0, 255)
      x.set(1, i+32, j+32, 1, 255)
      x.set(1, i+32, j+32, 2, 255)
      x.set(1, i+32, j+32, 3, 255)
    }
  }
  testArray(t, x, 'temp.gif', 'gif', function() {
    t.end()
  })
})

t('save-pixels saving 2 jpeg images with the same quality are identical', function(t) {
  var x = zeros([64, 64, 3])
  var firstFilepath = 'temp1.jpeg'
  var secondFilepath = 'temp2.jpeg'

  for(var i=0; i<64; ++i) {
    for(var j=0; j<64; ++j) {
      // 1x1 black and white checkerboard pattern
      var value = (i % 2 === 0 && j % 2 === 0) ? 255 : 0
      x.set(i, j, 0, value)
      x.set(i, j, 1, value)
      x.set(i, j, 2, value)
    }
  }
  writePixels(t, x, firstFilepath, 'jpeg', {quality: 20}, function(err) {
    if(err) {
      t.assert(false, err)
      t.end()
      return
    }

    writePixels(t, x, secondFilepath, 'jpeg', {quality: 20}, function(err) {
      if(err) {
        t.assert(false, err)
        t.end()
        return
      }

      assertImagesEqual(t, firstFilepath, secondFilepath, function() {
        if (!process.env.TEST_DEBUG) {
          fs.unlinkSync(firstFilepath)
          fs.unlinkSync(secondFilepath)
        }

        t.end()
      })
    })
  })
})

t('save-pixels saving 2 jpeg images with the different qualities are different', function(t) {
  var x = zeros([64, 64, 3])
  var lowQualityFilepath = 'temp-low.jpeg'
  var highQualityFilepath = 'temp-high.jpeg'

  for(var i=0; i<64; ++i) {
    for(var j=0; j<64; ++j) {
      // 1x1 black and white checkerboard pattern
      var value = (i % 2 === 0 && j % 2 === 0) ? 255 : 0
      x.set(i, j, 0, value)
      x.set(i, j, 1, value)
      x.set(i, j, 2, value)
    }
  }
  writePixels(t, x, lowQualityFilepath, 'jpeg', {quality: 1}, function(err) {
    if(err) {
      t.assert(false, err)
      t.end()
      return
    }

    writePixels(t, x, highQualityFilepath, 'jpeg', {quality: 100}, function(err) {
      if(err) {
        t.assert(false, err)
        t.end()
        return
      }

      assertImagesNotEqual(t, lowQualityFilepath, highQualityFilepath, function() {
        if (!process.env.TEST_DEBUG) {
          fs.unlinkSync(lowQualityFilepath)
          fs.unlinkSync(highQualityFilepath)
        }

        t.end()
      })
    })
  })
})
