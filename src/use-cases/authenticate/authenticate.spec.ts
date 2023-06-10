import { describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InMemoryUsersRepository } from '@/repositories/prisma/in-memory/in-memory-users-respository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { hash } from 'bcryptjs'

describe('Authenticate use case', () => {
  it('should be able to authenticate', async () => {
    const userRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(userRepository)

    await userRepository.create({
      email: 'test@example.com',
      password_hash: await hash('123456', 6),
      name: 'test',
    })

    const { user } = await authenticateUseCase.execute({
      email: 'test@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const userRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(userRepository)

    await userRepository.create({
      email: 'test@example.com',
      password_hash: await hash('123456', 6),
      name: 'test',
    })

    await expect(() =>
      authenticateUseCase.execute({
        email: 'test1@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const userRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(userRepository)

    await userRepository.create({
      email: 'test@example.com',
      password_hash: await hash('123456', 6),
      name: 'test',
    })

    await expect(() =>
      authenticateUseCase.execute({
        email: 'test@example.com',
        password: '458965',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
