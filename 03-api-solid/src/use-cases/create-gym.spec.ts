import { describe, it, expect, beforeEach } from 'vitest'

import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

describe('Create Gym Use Case', () => {
	let gymsRepository: GymsRepository
	let sut: CreateGymUseCase

	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new CreateGymUseCase(gymsRepository)
	})

	it('sould be able to create a gym', async () => {
		const { gym } = await sut.execute({
			title: 'My gym',
			description: 'the cheapest in town',
			phone: null,
			latitude: 40.6970293,
			longitude: -74.3093227,
		})

		expect(gym.id).toEqual(expect.any(String))
	})
})
