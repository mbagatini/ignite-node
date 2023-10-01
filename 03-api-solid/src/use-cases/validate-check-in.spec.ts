import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'

describe('Validate Check-in Use Case', () => {
	let checkInsRepository: CheckInsRepository
	let sut: ValidateCheckInUseCase

	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new ValidateCheckInUseCase(checkInsRepository)
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
		expect(() => {
			sut.execute({ checkInId: 'invalid-id' })
		}).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})
