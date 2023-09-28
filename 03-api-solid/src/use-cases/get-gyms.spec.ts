import { GymsRepository } from '@/repositories/gyms-repository'
import { GetGymsUseCase } from './get-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Get Gyms Use Case', () => {
	let gymsRepository: GymsRepository
	let sut: GetGymsUseCase

	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new GetGymsUseCase(gymsRepository)
	})

	it('should be able to get gyms by title', async () => {
		await gymsRepository.create({
			title: 'Coolest Gym',
			description: 'the cheapest in town',
			phone: null,
			latitude: 40.6970293,
			longitude: -74.3093227,
		})

		Array.from({ length: 5 }).map(async (_, index) => {
			await gymsRepository.create({
				title: `Random Gym ${index}`,
				description: 'the cheapest in town',
				phone: null,
				latitude: 40.6970293,
				longitude: -74.3093227,
			})
		})

		const response = await sut.execute({ query: 'Random Gym', page: 1 })

		expect(response.gyms).toHaveLength(5)
	})

	it('should be able to get gyms paginated', async () => {
		Array.from({ length: 22 }).map(async (_, index) => {
			await gymsRepository.create({
				title: `Random Gym ${index}`,
				description: 'the cheapest in town',
				phone: null,
				latitude: 40.6970293,
				longitude: -74.3093227,
			})
		})

		const response = await sut.execute({ query: 'Random Gym', page: 2 })

		expect(response.gyms).toHaveLength(2)
		expect(response.gyms).toEqual([
			expect.objectContaining({ title: 'Random Gym 20' }),
			expect.objectContaining({ title: 'Random Gym 21' }),
		])
	})
})
