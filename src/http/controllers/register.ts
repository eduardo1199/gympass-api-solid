import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { registerUserService } from '@/services/user-register'

export async function RegisterUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = registerBodySchema.parse(request.body)

  try {
    await registerUserService({ name, email, password })
  } catch (err) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
