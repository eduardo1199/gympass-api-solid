import { beforeEach, describe, expect, it } from 'vitest'
import { CheckInUseCase } from './checkin'
import { InMemoryCheckInRepository } from '@/repositories/prisma/in-memory/in-memory-checkin-repository'

let checkInRepository: InMemoryCheckInRepository
let createCheckInUseCase: CheckInUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    createCheckInUseCase = new CheckInUseCase(checkInRepository)
  })

  it('should be able to check-in', async () => {
    const checkIn = await createCheckInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.checkIn.id).toEqual(expect.any(String))
  })
})
