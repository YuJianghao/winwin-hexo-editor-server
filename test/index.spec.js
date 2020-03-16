/* eslint-disable no-undef */
const hexoEditorServer = require('../index')

test('koa app required', () => {
  expect(function () {
    hexoEditorServer()
  }).toThrowError('koa app required')
})

describe('valid base', () => {
  const app = { }
  test('', () => {
    var opts = { base: '' }
    expect(function () {
      hexoEditorServer(app, opts)
    }).toThrowError(new TypeError('app.use is not a function'))
    expect(opts.base).toBe('/hexo/')
    expect(opts.prefix).toBe('/hexo')
  })
  test('/', () => {
    var opts = { base: '/' }
    expect(function () {
      hexoEditorServer(app, opts)
    }).toThrowError(new TypeError('app.use is not a function'))
    expect(opts.base).toBe('/')
    expect(opts.prefix).toBe('')
  })
  test('/hexo', () => {
    var opts = { base: '/hexo' }
    expect(function () {
      hexoEditorServer(app, opts)
    }).toThrowError(new TypeError('app.use is not a function'))
    expect(opts.base).toBe('/hexo/')
    expect(opts.prefix).toBe('/hexo')
  })
  test('hexo', () => {
    var opts = { base: 'hexo' }
    expect(function () {
      hexoEditorServer(app, opts)
    }).toThrowError(new TypeError('app.use is not a function'))
    expect(opts.base).toBe('/hexo/')
    expect(opts.prefix).toBe('/hexo')
  })
  test('hexo/', () => {
    var opts = { base: 'hexo/' }
    expect(function () {
      hexoEditorServer(app, opts)
    }).toThrowError(new TypeError('app.use is not a function'))
    expect(opts.base).toBe('/hexo/')
    expect(opts.prefix).toBe('/hexo')
  })
  test('/hexo/', () => {
    var opts = { base: '/hexo/' }
    expect(function () {
      hexoEditorServer(app, opts)
    }).toThrowError(new TypeError('app.use is not a function'))
    expect(opts.base).toBe('/hexo/')
    expect(opts.prefix).toBe('/hexo')
  })
})

describe('invalid base', () => {
  const app = {}
  test('//', () => {
    var opts = { base: '//' }
    expect(function () {
      hexoEditorServer(app, opts)
    }).toThrowError('Invalid opts.base!')
  })
  test('//hexo', () => {
    var opts = { base: '//hexo' }
    expect(function () {
      hexoEditorServer(app, opts)
    }).toThrowError('Invalid opts.base!')
  })
  test('hexo//', () => {
    var opts = { base: 'hexo//' }
    expect(function () {
      hexoEditorServer(app, opts)
    }).toThrowError('Invalid opts.base!')
  })
  test('/hexo/hexo/', () => {
    var opts = { base: '/hexo/hexo/' }
    expect(function () {
      hexoEditorServer(app, opts)
    }).toThrowError('Invalid opts.base!')
  })
})
