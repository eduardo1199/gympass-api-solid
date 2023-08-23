import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import { InMemoryUsersRepository } from '@/repositories/prisma/in-memory/in-memory-users-respository'
import { hash } from 'bcryptjs'
import { ResourceNotFountError } from '../errors/resource-not-found-error'

let userRepository: InMemoryUsersRepository
let getUseProfileUseCase: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    getUseProfileUseCase = new GetUserProfileUseCase(userRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await userRepository.create({
      email: 'test@example.com',
      password_hash: await hash('123456', 6),
      name: 'John Doe',
    })

    const { user } = await getUseProfileUseCase.execute({
      userId: createdUser.id,
    })

    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      getUseProfileUseCase.execute({
        userId: 'not-exist-id-by-user',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFountError)
  })
})
