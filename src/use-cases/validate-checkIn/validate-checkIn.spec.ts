import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ValidateCheckInUseCase } from './index'
import { InMemoryCheckInRepository } from '@/repositories/prisma/in-memory/in-memory-checkin-repository'
import { ResourceNotFountError } from '../errors/resource-not-found-error'
import { LateCheckInValidate } from '../errors/late-check-in-validate-error'

let checkInRepository: InMemoryCheckInRepository
let validateCheckInUseCase: ValidateCheckInUseCase

describe('Validate check-in use case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository()
    validateCheckInUseCase = new ValidateCheckInUseCase(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await validateCheckInUseCase.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.checkIns[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    expect(() =>
      validateCheckInUseCase.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFountError)
  })

  it('should not be able to validate the check-in afeter 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 8, 12, 10, 23))

    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesOnMS = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesOnMS)

    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidate)
  })
})
