'use strict'


var t = require('tape')
var save = require('./')
var fixture = require('./fixture')
var isBrowser = require('is-browser')

// save
t('save to file', async t => {
  if (isBrowser) return t.end()

  await save(fixture, 'file.png')

  t.end()
})

t('save to canvas, context', async t => {
  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d')

  await save(fixture, canvas)
  var idata = context.getImageData(0, 0, canvas.width, canvas.height)
  t.deepEqual(idata.data, fixture.data)

  await save(fixture, context)
  var idata = context.getImageData(0, 0, canvas.width, canvas.height)
  t.deepEqual(idata.data, fixture.data)

  t.end()
})

t('save to array', async t => {
  t.end()
})

t('save to typed array', async t => {

  t.end()
})

t('save to ndarray', async t => {

  t.end()
})

t('save to buffer', async t => {

  t.end()
})


t('readme case', async t => {

})

t('encode into jpg', async t => {

})

t('encode into png', async t => {

})

t('endode into bmp', async t => {

})
