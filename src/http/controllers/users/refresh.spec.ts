import request from 'supertest'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'

describe('Refresh token (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to refresh token', async () => {
    await request(app.server).post('/users').send({
      name: 'Jonh Doe',
      email: 'jonh.doe@gmail.com',
      password: '123456',
    })

    const responseAuth = await request(app.server).post('/session').send({
      email: 'jonh.doe@gmail.com',
      password: '123456',
    })

    const cookies = responseAuth.get('Set-Cookie')

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
