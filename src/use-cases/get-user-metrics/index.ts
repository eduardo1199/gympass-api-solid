import { CheckInRepository } from '../../repositories/prisma/checkin-repository'

interface GetUserMetricsUseCaseCaseRequest {
  userId: string
}

interface GetMetricsUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCaseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseCaseRequest): Promise<GetMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
