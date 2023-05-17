import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterUserRequest {
  name: string
  email: string
  password: string
}

export async function registerUserService({
  name,
  email,
  password,
}: RegisterUserRequest) {
  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('E-mail already registered!')
  }

  await prisma.user.create({
    data: {
      name,
      password_hash,
      email,
    },
  })
}
