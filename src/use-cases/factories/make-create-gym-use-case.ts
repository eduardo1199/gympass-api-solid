import { PrismaGymsRepository } from '@/repositories/prisma/prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '../gym'

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CreateGymUseCase(gymsRepository)

  return useCase
}
