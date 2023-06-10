import { describe, expect, it } from 'vitest'
import { RegisterUserCase } from './user-register'
import { compare } from 'bcryptjs'

describe('Register use case', () => {
  it('should hash user register upon registration', async () => {
    const registerUserCaseService = new RegisterUserCase({
      async create(data) {
        return {
          email: data.email,
          created_at: new Date(),
          id: 'user-1',
          name: data.name,
          password_hash: data.password_hash,
        }
      },
      async findByEmail() {
        return null
      },
    })

    const { user } = await registerUserCaseService.execute({
      email: 'test@example.com',
      name: 'testing name',
      password: '123456',
    })

    const isPasswordCorrectlyHash = await compare('123456', user.password_hash)

    expect(isPasswordCorrectlyHash).toBe(true)
  })
})
