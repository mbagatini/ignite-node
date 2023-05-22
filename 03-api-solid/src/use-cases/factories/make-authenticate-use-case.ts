import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase(): AuthenticateUseCase {
	const userRepository = new PrismaUsersRepository()
	const authenticateUseCase = new AuthenticateUseCase(userRepository)

	return authenticateUseCase
}
