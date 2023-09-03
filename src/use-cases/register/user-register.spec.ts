import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUserCase } from './user-register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/prisma/in-memory/in-memory-users-respository'
import { UserAlreadyExistsError } from '../errors/user-already-exists'

let userRepository: InMemoryUsersRepository
let registerUserCaseService: RegisterUserCase

describe('Register use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    registerUserCaseService = new RegisterUserCase(userRepository)
  })

  it('should be able to register', async () => {
    const { user } = await registerUserCaseService.execute({
      email: 'test@example.com',
      name: 'testing name',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user register upon registration', async () => {
    const { user } = await registerUserCaseService.execute({
      email: 'test@example.com',
      name: 'testing name',
      password: '123456',
    })

    const isPasswordCorrectlyHash = await compare('1234567', user.password_hash)

    expect(isPasswordCorrectlyHash).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'test@example.com'

    await registerUserCaseService.execute({
      email,
      name: 'testing name',
      password: '123456',
    })

    await expect(() =>
      registerUserCaseService.execute({
        email,
        name: 'testing name',
        password: '892651',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
