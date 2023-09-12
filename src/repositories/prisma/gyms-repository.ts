import { Gym, Prisma } from '@prisma/client'

export interface findManyNearby {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  findById(gymId: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findMany(search: string, page: number): Promise<Gym[]>
  findManyNearby(params: findManyNearby): Promise<Gym[]>
}
