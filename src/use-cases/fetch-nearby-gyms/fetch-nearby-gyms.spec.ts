import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGyms } from './index'
import { InMemoryGymsRepository } from '@/repositories/prisma/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let fetchNearbGymsUseCase: FetchNearbyGyms

describe('Fetch Nearby Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    fetchNearbGymsUseCase = new FetchNearbyGyms(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -5.8344579,
      longitude: -35.2075184,
      description: null,
      phone: null,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -20.1390045,
      longitude: -44.3922635,
      description: null,
      phone: null,
    })

    const { gyms } = await fetchNearbGymsUseCase.execute({
      userLatitute: -5.8344579,
      userLongitude: -35.2075184,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
