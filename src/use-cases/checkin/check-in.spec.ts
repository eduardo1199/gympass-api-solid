import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './checkin'
import { InMemoryCheckInRepository } from '@/repositories/prisma/in-memory/in-memory-checkin-repository'

let checkInRepository: InMemoryCheckInRepository
let createCheckInUseCase: CheckInUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    createCheckInUseCase = new CheckInUseCase(checkInRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check-in', async () => {
    const checkIn = await createCheckInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 7, 22))

    await createCheckInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    await expect(
      async () =>
        await createCheckInUseCase.execute({
          gymId: 'gym-01',
          userId: 'user-01',
        }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to check-in in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 7, 22))

    await createCheckInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    vi.setSystemTime(new Date(2023, 7, 23))

    const checkIn = await createCheckInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.checkIn.id).toEqual(expect.any(String))
  })
})
