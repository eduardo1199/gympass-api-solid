import { FastifyInstance } from 'fastify'
import { RegisterUser } from './controllers/register'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', RegisterUser)
}
