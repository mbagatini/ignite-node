import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { GetNearbyGymsUseCase } from '../get-nearby-gyms'

export function makeGetNearbyGymsUseCase(): GetNearbyGymsUseCase {
	const gymsRepository = new PrismaGymsRepository()
	const getNearbyGymsUseCase = new GetNearbyGymsUseCase(gymsRepository)

	return getNearbyGymsUseCase
}
