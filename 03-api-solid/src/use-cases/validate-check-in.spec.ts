import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { ValidationError } from '@/errors/validation-error'

describe('Validate Check-in Use Case', () => {
	let checkInsRepository: CheckInsRepository
	let sut: ValidateCheckInUseCase

	beforeEach(() => {
		vi.useFakeTimers()

		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new ValidateCheckInUseCase(checkInsRepository)
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to validate check-in', async () => {
		const createdCheckIn = await checkInsRepository.create({
			gym_id: 'gym-id',
			user_id: 'user-id',
		})

		const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id })

		expect(checkIn.validated_at).toEqual(expect.any(Date))
	})

	it('should not be able to validate a invalid check-in', async () => {
		await expect(() =>
			sut.execute({ checkInId: 'invalid-id' }),
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not be able to validate a check-in after 20 minutes of its creation', async () => {
		vi.setSystemTime(new Date(2023, 0, 1, 13, 10))

		const createdCheckIn = await checkInsRepository.create({
			gym_id: 'gym-id',
			user_id: 'user-id',
		})

		vi.advanceTimersByTime(1000 * 60 * 21) // 21 minutes

		await expect(() =>
			sut.execute({ checkInId: createdCheckIn.id }),
		).rejects.toBeInstanceOf(ValidationError)
	})
})
