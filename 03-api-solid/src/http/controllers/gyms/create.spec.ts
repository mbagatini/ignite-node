import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Gym (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a gym', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const response = await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Olimpo Gym',
				description: 'Some description',
				phone: null,
				latitude: 40.0833625,
				longitude: 22.3499207,
			})

		expect(response.statusCode).toEqual(201)
	})
})
