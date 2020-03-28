const Koa = require('koa')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const cors = require('koa2-cors')
const hexoeditorserver = require('../index')
const app = new Koa()

// error handler
onerror(app)

// cors !important for API usage
app.use(cors())

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())

// mount hexo-editor-server to koa app
hexoeditorserver(app, { base: '/hexo' /* auth: */ /* some authentication middleware */, hexoRoot: 'your/blog/path' })

const http = require('http')
const server = http.createServer(app.callback())
const port = 3000
server.listen(port)
server.on('error', err => console.error(err))
server.on('listening', () => {
  console.log(`Server is listening on posrt ${port}!`)
  console.log(`Please visit http://localhost:${port}/hexo/`)
})
