import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

describe('Check-in (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to validate check-in', async () => {
		const { user, token } = await createAndAuthenticateUser(app, true)

		const createGymUseCase = makeCreateGymUseCase()

		const { gym } = await createGymUseCase.execute({
			title: 'Olimpo Gym',
			description: 'Some description',
			phone: null,
			latitude: 40.0833625,
			longitude: 22.3499207,
		})

		const checkInUseCase = makeCheckInUseCase()

		const { checkIn } = await checkInUseCase.execute({
			userId: user.id,
			gymId: gym.id,
			userLatitude: 40.0833621,
			userLongitude: 22.3499211,
		})

		const response = await request(app.server)
			.patch(`/check-ins/${checkIn.id}/validate`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(204)
	})
})
