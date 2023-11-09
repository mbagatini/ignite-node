import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Profile (e2e', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get user profile', async () => {
		await request(app.server).post('/users').send({
			name: 'John Doe',
			email: 'john@example.com',
			password: '1234567',
		})

		const authResponse = await request(app.server).post('/sessions').send({
			email: 'john@example.com',
			password: '1234567',
		})

		const { token } = authResponse.body

		const profileReponse = await request(app.server)
			.get('/sessions/me')
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(profileReponse.statusCode).toEqual(200)
		expect(profileReponse.body.user).toEqual(
			expect.objectContaining({
				email: 'john@example.com',
			}),
		)
	})
})
