'use strict'

require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Boom = require('@hapi/boom')

const appPort = process.env.PORT ? process.env.PORT : 8000

const server = Hapi.server({
  port: appPort,
  host: '0.0.0.0'
})

const addAPIs = async () => server.register([require('./api/movie').movieJson, require('./api/poster').posterJpeg], { routes: { prefix: '/api' } })

const init = async () => {
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'omdb-bot is available'
    }
  })
  server.route({
    method: '*',
    path: '/{any*}',
    handler: (request, h) => {
      return Boom.notFound()
    }
  })
  await addAPIs()
  await server.start()
  console.log(`Server up at ${server.info.uri}`)
}

/*
** The following complements DEP0018 by forcing uncaught promise rejections to crash the app.
** This can also be done via mcollina's 'make-promises-safe' module.
*/
process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})
/*
** Setup is complete. Execute the server init() command.
*/
init()
