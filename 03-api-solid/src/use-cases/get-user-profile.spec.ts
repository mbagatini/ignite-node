import { hashSync } from 'bcryptjs'
import { describe, it, expect, beforeEach } from 'vitest'

import { GetUserProfileUseCase } from './get-user-profile'
import { UsersRepository } from '@/repositories/users-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'

describe('Get User Profile Use Case', () => {
	let userRepository: UsersRepository
	let sut: GetUserProfileUseCase

	beforeEach(async () => {
		userRepository = new InMemoryUsersRepository()
		sut = new GetUserProfileUseCase(userRepository)
	})

	it('should be able to get user profile', async () => {
		const user = await userRepository.create({
			email: 'user@example.com',
			name: 'John Doe',
			password_hash: hashSync('123456', 6),
		})

		const userProfile = await sut.execute({ id: user.id })

		expect(userProfile.user.email).toEqual('user@example.com')
	})

	it('should not be able to get user profile with inexisting id', async () => {
		await expect(() => sut.execute({ id: '99' })).rejects.toBeInstanceOf(
			ResourceNotFoundError,
		)
	})
})
