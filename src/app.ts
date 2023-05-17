import { env } from './env'
import { fastify } from 'fastify'
import { appRoutes } from './http/routes'

export const app = fastify({
  logger: true,
})

app.register(appRoutes)

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('listening server run on port 3333')
  })
