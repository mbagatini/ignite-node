import { UsersRepository } from '@/repositories/users-repository'
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest'
import { hashSync } from 'bcryptjs'

import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { ValidationError } from '@/errors/validation-error'

describe('Check in Use Case', () => {
	let checkInsRepository: CheckInsRepository
	let gymsRepository: GymsRepository
	let usersRepository: UsersRepository
	let sut: CheckInUseCase

	beforeEach(() => {
		// vitest: fake date mocking
		vi.useFakeTimers()

		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		usersRepository = new InMemoryUsersRepository()

		sut = new CheckInUseCase(checkInsRepository, gymsRepository)
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to check in', async () => {
		const user = await usersRepository.create({
			name: 'John Doe',
			email: 'john@doe.com',
			password_hash: hashSync('123456', 6),
		})

		const gym = await gymsRepository.create({
			title: 'NiceGym',
			latitude: 40.6970293,
			longitude: -74.3093227,
		})

		const { checkIn } = await sut.execute({
			gymId: gym.id,
			userId: user.id,
			userLatitude: 40.6970193,
			userLongitude: -74.3093127,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2022, 0, 10, 14, 0, 0)) // 10 Jan 2022 14:00

		const user = await usersRepository.create({
			name: 'John Doe',
			email: 'john@doe.com',
			password_hash: hashSync('123456', 6),
		})

		const gym = await gymsRepository.create({
			title: 'NiceGym',
			latitude: 40.6970293,
			longitude: -74.3093227,
		})

		await sut.execute({
			gymId: gym.id,
			userId: user.id,
			userLatitude: 40.6970193,
			userLongitude: -74.3093127,
		})

		await expect(() =>
			sut.execute({
				gymId: gym.id,
				userId: user.id,
				userLatitude: 40.6970193,
				userLongitude: -74.3093127,
			}),
		).rejects.toBeInstanceOf(ValidationError)
	})

	it('should be able to check in twice in different dates', async () => {
		vi.setSystemTime(new Date(2022, 0, 10, 14, 0, 0)) // 10 Jan 2022 14:00

		const user = await usersRepository.create({
			name: 'John Doe',
			email: 'john@doe.com',
			password_hash: hashSync('123456', 6),
		})

		const gym = await gymsRepository.create({
			title: 'NiceGym',
			latitude: 40.6970293,
			longitude: -74.3093227,
		})

		await sut.execute({
			gymId: gym.id,
			userId: user.id,
			userLatitude: 40.6970193,
			userLongitude: -74.3093127,
		})

		vi.setSystemTime(new Date(2022, 0, 11, 14, 0, 0)) // 11 Jan 2022 14:00

		const { checkIn } = await sut.execute({
			gymId: gym.id,
			userId: user.id,
			userLatitude: 40.6970193,
			userLongitude: -74.3093127,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in when gym does not exists', async () => {
		const user = await usersRepository.create({
			name: 'John Doe',
			email: 'john@doe.com',
			password_hash: hashSync('123456', 6),
		})

		await expect(
			sut.execute({
				gymId: 'inexistent_gym',
				userId: user.id,
				userLatitude: 40.6970193,
				userLongitude: -74.3093127,
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should be not be able to check in when user is not near the gym', async () => {
		const user = await usersRepository.create({
			name: 'John Doe',
			email: 'john@doe.com',
			password_hash: hashSync('123456', 6),
		})

		const gym = await gymsRepository.create({
			title: 'NiceGym',
			latitude: 40.6988088,
			longitude: -74.199149,
		})

		await expect(
			sut.execute({
				gymId: gym.id,
				userId: user.id,
				userLatitude: 40.6970193,
				userLongitude: -74.3093127,
			}),
		).rejects.toBeInstanceOf(ValidationError)
	})
})
