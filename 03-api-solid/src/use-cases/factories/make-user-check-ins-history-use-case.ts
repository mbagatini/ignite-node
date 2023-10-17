import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetUserCheckInsHistoryUseCase } from '../get-user-check-ins-history'

export function makeGetUserCheckInsHistoryUseCase(): GetUserCheckInsHistoryUseCase {
	const checkInsRepository = new PrismaCheckInsRepository()
	const userCheckInsHistoryUseCase = new GetUserCheckInsHistoryUseCase(
		checkInsRepository,
	)

	return userCheckInsHistoryUseCase
}
