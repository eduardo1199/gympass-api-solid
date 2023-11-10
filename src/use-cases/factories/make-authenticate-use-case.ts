import { PrismaUsersRepository } from '@/repositories/prisma/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate/authenticate'

export function MakeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const authenticateUserCaseService = new AuthenticateUseCase(usersRepository)

  return authenticateUserCaseService
}
