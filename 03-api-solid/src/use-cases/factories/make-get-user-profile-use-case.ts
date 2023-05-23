import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile'

export function makeGetUserProfileUseCase(): GetUserProfileUseCase {
	const userRepository = new PrismaUsersRepository()
	const getUserProfileUseCase = new GetUserProfileUseCase(userRepository)

	return getUserProfileUseCase
}
