import { z } from 'zod'
import { prisma } from './lib/prisma'
import { env } from './env'
import { fastify } from 'fastify'

export const app = fastify({
  logger: true,
})

app.post('/user', async (request, reply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = registerBodySchema.parse(request.body)

  await prisma.user.create({
    data: {
      name,
      password_hash: password,
      email,
    },
  })

  return reply.status(201).send()
})

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('listening server run on port 3333')
  })
