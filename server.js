var path = require('path')
var express = require('express')
var proxyMiddleware = require('http-proxy-middleware')

var services = [
  {
    port: 81,
    proxyTable: {
      '/npauth': {
        target: 'http://192.168.12.49:9102'
      },
      '/npconfig': {
        target: 'http://192.168.12.49:9102'
      }
    }
  }
]

var list = []

services = services.map((obj) => {
  var port = obj.port
  var proxyTable = obj.proxyTable
  var app = express()

  Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
      options = {target: options}
    }
    app.use(proxyMiddleware(options.filter || context, options))
  })

  var staticPath = path.posix.join('/')
  app.use(staticPath, express.static('./dist'))

  var uri = 'http://localhost:' + port
  
  var promise = new Promise(resolve => {
    console.log('> Listening at ' + uri + '\n')
    resolve()
  })
  console.log('> Starting dev server...')

  list.push(promise)

  return app.listen(port)
})

module.exports = {
  ready: Promise.all(list),
  close: () => {
    services.forEach((server) => {
      server.close()
    })
  }
}
