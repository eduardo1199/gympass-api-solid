import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { RegisterUserCase } from '@/use-cases/user-register'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

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
    const usersRepository = new PrismaUsersRepository()
    const registerUserCaseService = new RegisterUserCase(usersRepository)


    await registerUserCaseService.execute({ name, email, password })
  } catch (err) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
