import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/prisma/gyms-repository'

interface FetchNearbyGymsRequest {
  userLatitute: number
  userLongitude: number
}

interface FetchNearbyGymsResponse {
  gyms: Gym[]
}

export class FetchNearbyGyms {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitute,
    userLongitude,
  }: FetchNearbyGymsRequest): Promise<FetchNearbyGymsResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitute,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
