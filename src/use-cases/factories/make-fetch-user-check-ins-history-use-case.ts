import { FetchUserCheckInsUseCase } from '../fetch-user-checkins-history/fetch-user-checkins-history'
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma/prisma-checkin-repository'

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInRepository()
  const useCase = new FetchUserCheckInsUseCase(checkInsRepository)

  return useCase
}
