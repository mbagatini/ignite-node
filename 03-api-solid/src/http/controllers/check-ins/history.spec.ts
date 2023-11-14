import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

describe('Check-in (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
		// vitest: fake date mocking
		vi.useFakeTimers()
	})

	afterAll(async () => {
		vi.useRealTimers()
		await app.close()
	})

	it("should be able to get user's check-in history", async () => {
		const { user, token } = await createAndAuthenticateUser(app)

		const createGymUseCase = makeCreateGymUseCase()

		const { gym } = await createGymUseCase.execute({
			title: 'Olimpo Gym',
			description: 'Some description',
			phone: null,
			latitude: 40.0833625,
			longitude: 22.3499207,
		})

		const checkInUseCase = makeCheckInUseCase()

		vi.setSystemTime(new Date(2022, 0, 10, 14, 0, 0)) // 10 Jan 2022 14:00

		await checkInUseCase.execute({
			userId: user.id,
			gymId: gym.id,
			userLatitude: 40.0833621,
			userLongitude: 22.3499211,
		})

		vi.setSystemTime(new Date(2022, 0, 11, 14, 0, 0)) // 11 Jan 2022 14:00

		await checkInUseCase.execute({
			userId: user.id,
			gymId: gym.id,
			userLatitude: 40.0833621,
			userLongitude: 22.3499211,
		})

		const response = await request(app.server)
			.get('/check-ins/history')
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.checkIns).toHaveLength(2)
		expect(response.body.checkIns[0]).toEqual(
			expect.objectContaining({
				user_id: user.id,
				gym_id: gym.id,
			}),
		)
		expect(response.body.checkIns[1]).toEqual(
			expect.objectContaining({
				user_id: user.id,
				gym_id: gym.id,
			}),
		)
	})
})
