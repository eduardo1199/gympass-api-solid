import request from 'supertest'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    await request(app.server).post('/users').send({
      name: 'Jonh Doe',
      email: 'jonh.doe@gmail.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/session').send({
      email: 'jonh.doe@gmail.com',
      password: '123456',
    })

    const { token } = authResponse.body

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'jonh.doe@gmail.com',
      }),
    )
  })
})
