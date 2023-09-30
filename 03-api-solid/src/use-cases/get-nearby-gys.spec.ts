import { GymsRepository } from '@/repositories/gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetNearbyGymsUseCase } from './get-nearby-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

describe('Get Nearby Gyms Use Case', () => {
	let gymsRepository: GymsRepository
	let sut: GetNearbyGymsUseCase

	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new GetNearbyGymsUseCase(gymsRepository)
	})

	it('should return nearby gyms', async () => {
		const nearGym = await gymsRepository.create({
			title: 'Near gym',
			description: 'the cheapest in town',
			phone: null,
			latitude: 40.6970293,
			longitude: -74.3093227,
		})

		await gymsRepository.create({
			title: 'Far gym',
			description: 'the cheapest in town',
			phone: null,
			latitude: 39.7261399,
			longitude: -75.5514106,
		})

		const { gyms } = await sut.execute({
			userLatitude: 40.6980111,
			userLongitude: -74.3094909,
		})

		expect(gyms).toEqual([expect.objectContaining(nearGym)])
	})

	it('should not return far gyms', async () => {
		await gymsRepository.create({
			title: 'Far gym as well',
			description: 'the cheapest in town',
			phone: null,
			latitude: 42.9382746,
			longitude: -71.2399016,
		})

		await gymsRepository.create({
			title: 'Far gym',
			description: 'the cheapest in town',
			phone: null,
			latitude: 39.7261399,
			longitude: -75.5514106,
		})

		const { gyms } = await sut.execute({
			userLatitude: 40.6980111,
			userLongitude: -74.3094909,
		})

		expect(gyms).toHaveLength(0)
	})
})
