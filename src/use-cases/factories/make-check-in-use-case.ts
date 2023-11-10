import { PrismaGymsRepository } from '@/repositories/prisma/prisma/prisma-gyms-repository'
import { CheckInUseCase } from '../checkin/checkin'
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma/prisma-checkin-repository'

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInRepository()
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CheckInUseCase(checkInsRepository, gymsRepository)

  return useCase
}
