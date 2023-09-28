import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { describe, it, beforeEach, expect } from 'vitest'
import { GetUserCheckInsHistoryUseCase } from './get-user-check-ins-history'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

describe('Get User Check Ins History Use Case', () => {
	let checkInsRepository: CheckInsRepository
	let sut: GetUserCheckInsHistoryUseCase

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new GetUserCheckInsHistoryUseCase(checkInsRepository)
	})

	it('should be able to get user check-ins history', async () => {
		Array.from({ length: 5 }).map(async (_, index) => {
			await checkInsRepository.create({
				gym_id: `gym-0${index}`,
				user_id: 'user-01',
			})
		})

		const response = await sut.execute({ userId: 'user-01', page: 1 })

		expect(response.checkIns).toHaveLength(5)
		expect(response.checkIns).toEqual([
			expect.objectContaining({ gym_id: 'gym-00' }),
			expect.objectContaining({ gym_id: 'gym-01' }),
			expect.objectContaining({ gym_id: 'gym-02' }),
			expect.objectContaining({ gym_id: 'gym-03' }),
			expect.objectContaining({ gym_id: 'gym-04' }),
		])
	})

	it('should be able to get user check-ins history paginated', async () => {
		Array.from({ length: 22 }).map(async (_, index) => {
			await checkInsRepository.create({
				gym_id: `gym-${index}`,
				user_id: 'user-01',
			})
		})

		const response = await sut.execute({ userId: 'user-01', page: 1 })

		expect(response.checkIns).toHaveLength(20)
		expect(response.checkIns[19]).toEqual(
			expect.objectContaining({ gym_id: 'gym-19' }),
		)
	})
})
