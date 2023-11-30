import { GetUserMetricsUseCaseCase } from '../get-user-metrics'
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma/prisma-checkin-repository'

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInRepository()
  const useCase = new GetUserMetricsUseCaseCase(checkInsRepository)

  return useCase
}
