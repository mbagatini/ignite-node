import { CheckInUseCase } from '../check-in'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeCheckInUseCase(): CheckInUseCase {
	const checkInsRepository = new PrismaCheckInsRepository()
	const gymsRepository = new PrismaGymsRepository()
	const checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

	return checkInUseCase
}
