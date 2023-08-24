import { UsersRepository } from '@/repositories/prisma/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFountError } from '../errors/resource-not-found-error'

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findByUserId(userId)

    if (!user) {
      throw new ResourceNotFountError('Not exist user that id!')
    }

    return {
      user,
    }
  }
}
