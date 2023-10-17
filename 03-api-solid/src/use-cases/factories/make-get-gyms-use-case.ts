import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { GetGymsUseCase } from '../get-gyms'

export function makeGetGymsUseCase(): GetGymsUseCase {
	const gymsRepository = new PrismaGymsRepository()
	const getGymsUseCase = new GetGymsUseCase(gymsRepository)

	return getGymsUseCase
}
