import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserMetricsUseCaseCase } from './index'
import { InMemoryCheckInRepository } from '@/repositories/prisma/in-memory/in-memory-checkin-repository'

let checkInRepository: InMemoryCheckInRepository
let getUserMetricsUseCase: GetUserMetricsUseCaseCase

describe('Get User Metrics use case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository()
    getUserMetricsUseCase = new GetUserMetricsUseCaseCase(checkInRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
