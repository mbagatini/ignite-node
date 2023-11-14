import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Profile (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get user profile', async () => {
		const { token } = await createAndAuthenticateUser(app)

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
