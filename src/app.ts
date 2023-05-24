import { env } from './env'
import { fastify } from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'

export const app = fastify({
  logger: true,
})

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if(error instanceof ZodError) {
    return reply.status(400).send({ message: 'Validation Error', issues: error.format() })
  }

  if(env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external console tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal Server Error!'})
}) 

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('listening server run on port 3333')
  })
