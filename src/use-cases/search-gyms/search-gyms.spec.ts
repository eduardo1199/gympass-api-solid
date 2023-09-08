import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './index'
import { InMemoryGymsRepository } from '@/repositories/prisma/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let searchGymsUseCase: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    searchGymsUseCase = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search gyms', async () => {
    await gymsRepository.create({
      title: 'Teste Gym',
      latitude: -5.8344579,
      longitude: -35.2075184,
      description: null,
      phone: null,
    })

    await gymsRepository.create({
      title: 'Johndoe Gym',
      latitude: -5.8344579,
      longitude: -35.2075184,
      description: null,
      phone: null,
    })

    const { gyms } = await searchGymsUseCase.execute({
      page: 1,
      search: 'Teste Gym',
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Teste Gym' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Johndoe Gym ${i}`,
        latitude: -5.8344579,
        longitude: -35.2075184,
        description: null,
        phone: null,
      })
    }

    const { gyms } = await searchGymsUseCase.execute({
      page: 2,
      search: 'Johndoe Gym',
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Johndoe Gym 21' }),
      expect.objectContaining({ title: 'Johndoe Gym 22' }),
    ])
  })
})
