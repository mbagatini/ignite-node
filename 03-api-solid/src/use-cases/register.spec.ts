import { UsersRepository } from './../repositories/users-repository'
import { AlreadyExistsError } from './../errors/already-exists-error'
import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'

describe('Register Use Case', () => {
	let userRepository: UsersRepository
	let registerUseCase: RegisterUseCase

	beforeEach(() => {
		userRepository = new InMemoryUsersRepository()
		registerUseCase = new RegisterUseCase(userRepository)
	})

	it('should hash user password on registration', async () => {
		const { user } = await registerUseCase.execute({
			name: 'John Smith',
			email: 'john@example.com',
			password: '1234567890',
		})

		const passwordIsHashed = await compare('1234567890', user.password_hash)

		expect(passwordIsHashed).toBe(true)
	})

	it('should not be able to register with same e-mail', async () => {
		const email = 'john@example.com'

		await registerUseCase.execute({
			name: 'John Smith',
			email,
			password: '1234567890',
		})

		expect(async () => {
			await registerUseCase.execute({
				name: 'John Smith',
				email,
				password: '1234567890',
			})
		}).rejects.toBeInstanceOf(AlreadyExistsError)
	})

	it('should be able to register user', async () => {
		const { user } = await registerUseCase.execute({
			name: 'John Smith',
			email: 'john@example.com',
			password: '1234567890',
		})

		expect(user.id).toEqual(expect.any(String))
	})
})
