import { UsersRepository } from '@/repositories/users-repository'
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest'

import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hashSync } from 'bcryptjs'

describe('Check in Use Case', () => {
	let checkInsRepository: CheckInsRepository
	let usersRepository: UsersRepository
	let sut: CheckInUseCase

	beforeEach(() => {
		// vitest: fake date mocking
		vi.useFakeTimers()

		checkInsRepository = new InMemoryCheckInsRepository()
		usersRepository = new InMemoryUsersRepository()

		sut = new CheckInUseCase(checkInsRepository)
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

		const { checkIn } = await sut.execute({
			gymId: 'to define',
			userId: user.id,
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

		await sut.execute({
			gymId: 'to define',
			userId: user.id,
		})

		await expect(() =>
			sut.execute({
				gymId: 'to define',
				userId: user.id,
			}),
		).rejects.toBeInstanceOf(Error)
	})

	it('should be able to check in twice in different dates', async () => {
		vi.setSystemTime(new Date(2022, 0, 10, 14, 0, 0)) // 10 Jan 2022 14:00

		const user = await usersRepository.create({
			name: 'John Doe',
			email: 'john@doe.com',
			password_hash: hashSync('123456', 6),
		})

		await sut.execute({
			gymId: 'to define',
			userId: user.id,
		})

		vi.setSystemTime(new Date(2022, 0, 11, 14, 0, 0)) // 11 Jan 2022 14:00

		const { checkIn } = await sut.execute({
			gymId: 'to define',
			userId: user.id,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})
})
