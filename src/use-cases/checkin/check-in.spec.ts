import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './checkin'
import { InMemoryCheckInRepository } from '@/repositories/prisma/in-memory/in-memory-checkin-repository'
import { InMemoryGymsRepository } from '@/repositories/prisma/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInRepository: InMemoryCheckInRepository
let gymsRepository: InMemoryGymsRepository
let createCheckInUseCase: CheckInUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    gymsRepository = new InMemoryGymsRepository()
    createCheckInUseCase = new CheckInUseCase(checkInRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      description: 'Gym',
      title: 'Gym test',
      latitude: new Decimal(-5.8344579),
      longitude: new Decimal(-35.2075184),
      phone: '(84)846161861',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check-in', async () => {
    const checkIn = await createCheckInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -5.8344579,
      userLongitude: -35.2075184,
    })

    expect(checkIn.checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 7, 20))

    await createCheckInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -5.8344579,
      userLongitude: -35.2075184,
    })

    vi.setSystemTime(new Date(2023, 7, 20))

    expect(
      createCheckInUseCase.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -5.8344579,
        userLongitude: -35.2075184,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to check-in in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 7, 22))

    await createCheckInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -5.8344579,
      userLongitude: -35.2075184,
    })

    vi.setSystemTime(new Date(2023, 7, 23))

    const checkIn = await createCheckInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -5.8344579,
      userLongitude: -35.2075184,
    })

    expect(checkIn.checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in in on distance gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      description: 'Gym',
      title: 'Gym test',
      latitude: new Decimal(-5.8344579),
      longitude: new Decimal(-35.2075184),
      phone: '(84)846161861',
    })

    expect(
      createCheckInUseCase.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -5.8980271,
        userLongitude: -35.2697794,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
