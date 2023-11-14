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

	it('should be able to search a gym', async () => {
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
				latitude: 42.0833625,
				longitude: 25.3499207,
			})

		const response = await request(app.server)
			.get('/gyms/search')
			.set('Authorization', `Bearer ${token}`)
			.query({
				query: 'Olimpo',
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
