import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

describe('Get User Metrics Use Case', () => {
	let checkInsRepository: CheckInsRepository
	let sut: GetUserMetricsUseCase

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new GetUserMetricsUseCase(checkInsRepository)
	})

	it('should get the user check-ins count', async () => {
		Array.from({ length: 5 }).map(async (_, index) => {
			await checkInsRepository.create({
				gym_id: `gym-0${index}`,
				user_id: 'user-01',
			})
		})

		const response = await sut.execute({ userId: 'user-01' })

		expect(response.checkInsCount).toBe(5)
	})
})
