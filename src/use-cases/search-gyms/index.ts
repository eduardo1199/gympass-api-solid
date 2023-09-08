import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/prisma/gyms-repository'

interface SearchGymsUseCaseRequest {
  search: string
  page: number
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    search,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findMany(search, page)

    return { gyms }
  }
}
