import { CheckInRepository } from '../../repositories/prisma/checkin-repository'
import { CheckIn } from '@prisma/client'

interface FetchUserCheckInsUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckInsResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsUseCaseRequest): Promise<FetchUserCheckInsResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(userId, page)

    return {
      checkIns,
    }
  }
}
