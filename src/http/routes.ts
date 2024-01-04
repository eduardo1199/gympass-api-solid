import { FastifyInstance } from 'fastify'
import { registerUser } from './controllers/register'
import { authenticateUser } from './controllers/authenticate'
import { profile } from './controllers/profile'
import { verifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)

  app.post('/session', authenticateUser)

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
