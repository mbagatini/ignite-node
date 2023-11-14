import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

describe('Check-in (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to check in', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const createGymUseCase = makeCreateGymUseCase()

		const { gym } = await createGymUseCase.execute({
			title: 'Olimpo Gym',
			description: 'Some description',
			phone: null,
			latitude: 40.0833625,
			longitude: 22.3499207,
		})

		const response = await request(app.server)
			.post(`/gyms/${gym.id}/check-in`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				userLatitude: 40.0833621,
				userLongitude: 22.3499211,
			})

		expect(response.statusCode).toEqual(201)
	})
})
