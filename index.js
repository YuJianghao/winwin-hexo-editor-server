/**
 * @module hexo-editor-serever
 * @author winwin2011
 */

const debug = require('debug')('hexo-editor-server')
const router = require('koa-router')()

/**
 * mount hexo-editor-server to koa app
 * @param {Koa} app - koa app instance
 * @param {Object} opts - options
 * @param {String} [opts.base='/hexo/'] - hexo-editor-server base url. e.g. `/` or `/editor/`, default is `/hexo/`
 * @param {Function} [opts.auth] - custom authentication middleware
 * @returns {void}
 */
module.exports = function (app, opts = {}) {
  debug('module opts input', opts)

  if (!app) {
    // check if koa app exists
    console.error('This is not a function. Koa app is required.')
    console.error('Use `hexoeditorserver(app)` instead')
    throw new Error('koa app required')
  }

  if (opts.base) {
    // format server base and router prefix
    opts.base = (opts.base.slice(0, 1) === '/' ? '' : '/') + opts.base
    opts.base += opts.base.slice(-1) === '/' ? '' : '/'
    debug('module opts formated', opts)
  } else {
    opts.base = '/hexo/'
    console.log('using default base /hexo/')
  }
  opts.prefix = opts.base.slice(0, -1)

  // setup router prefix
  router.prefix(opts.prefix || '')

  // apply custom auth middleware
  if (opts.auth) {
    debug('apply custom auth middleware')
    router.get('/*', opts.auth)
  }

  // setup routes
  require('./src/router')(router)

  // setup router
  app.use(router.routes(), router.allowedMethods())
}
