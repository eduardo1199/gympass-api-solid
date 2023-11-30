import { PrismaCheckInRepository } from '@/repositories/prisma/prisma/prisma-checkin-repository'
import { ValidateCheckInUseCase } from '../validate-checkIn'

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInRepository()
  const useCase = new ValidateCheckInUseCase(checkInsRepository)

  return useCase
}
