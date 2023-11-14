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

	it('should be able to find a nearby gym', async () => {
		const { token } = await createAndAuthenticateUser(app)

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Olimpo Gym',
				description: 'Some description',
				phone: null,
				latitude: 40.0833625,
				longitude: 22.3499207,
			})

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Other Gym',
				description: 'Some description',
				phone: null,
				latitude: 60.0833625,
				longitude: 130.3499207,
			})

		const response = await request(app.server)
			.get('/gyms/nearby')
			.set('Authorization', `Bearer ${token}`)
			.query({
				latitude: 40.0833525,
				longitude: 22.34994491,
			})
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms[0]).toEqual(
			expect.objectContaining({
				title: 'Olimpo Gym',
			}),
		)
	})
})
