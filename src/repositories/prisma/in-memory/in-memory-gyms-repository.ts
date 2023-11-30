import { Gym, Prisma } from '@prisma/client'
import { GymsRepository, findManyNearby } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      phone: data.phone!,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      description: data.description ?? null,
    }

    this.items.push(gym)

    return gym
  }

  async findById(gymId: string): Promise<Gym | null> {
    const gym = this.items.find((gym) => gym.id === gymId)

    if (!gym) {
      return null
    }

    return gym
  }

  async findMany(search: string, page: number): Promise<Gym[]> {
    const gyms = this.items
      .filter((gym) => gym.title.includes(search))
      .slice((page - 1) * 20, page * 20)

    return gyms
  }

  async findManyNearby({
    latitude,
    longitude,
  }: findManyNearby): Promise<Gym[]> {
    const gyms = this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude,
          longitude,
        },
        {
          latitude: Number(gym.latitude),
          longitude: Number(gym.longitude),
        },
      )

      return distance < 10
    })

    return gyms
  }
}
