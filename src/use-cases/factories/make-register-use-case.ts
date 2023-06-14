import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUserCase } from '../register/user-register'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const registerUserCaseService = new RegisterUserCase(usersRepository)

  return registerUserCaseService
}
