import { FastifyInstance } from 'fastify'
import { registerUser } from './register'
import { authenticateUser } from './authenticate'
import { profile } from './profile'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)

  app.post('/session', authenticateUser)

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
