import { PrismaUsersRepository } from './../repositories/prisma-users-repository'
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
  const prismaUsersRepository = new PrismaUsersRepository()

  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prismaUsersRepository.sameEmailByUser(email)

  if (userWithSameEmail) {
    throw new Error('E-mail already registered!')
  }

  await prismaUsersRepository.create({ email, name, password_hash })
}
