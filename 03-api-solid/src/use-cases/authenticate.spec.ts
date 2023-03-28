import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { hashSync } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'

describe('Authenticate Use Case', () => {
	let userRepository: UsersRepository
	let sut: AuthenticateUseCase

	beforeEach(() => {
		userRepository = new InMemoryUsersRepository()
		sut = new AuthenticateUseCase(userRepository)
	})

	it('should throw error if user does not exists', async () => {
		await expect(() =>
			sut.execute({
				email: 'john@example.com',
				password: '1234567890',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should throw error if e-mail is incorrect', async () => {
		const authUser = {
			name: 'John Smith',
			email: 'john@example.com',
			password: '1234567890',
		}

		await userRepository.create({
			...authUser,
			password_hash: hashSync(authUser.password, 6),
		})

		await expect(() =>
			sut.execute({
				email: 'fakeone@lol.com',
				password: authUser.password,
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should throw error if password is incorrect', async () => {
		const authUser = {
			name: 'John Smith',
			email: 'john@example.com',
			password: '1234567890',
		}

		await userRepository.create({
			...authUser,
			password_hash: hashSync(authUser.password, 6),
		})

		await expect(() =>
			sut.execute({
				email: authUser.email,
				password: 'fakepass',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should be able to authenticate', async () => {
		const authUser = {
			name: 'John Smith',
			email: 'john@example.com',
			password: '1234567890',
		}

		await userRepository.create({
			...authUser,
			password_hash: hashSync(authUser.password, 6),
		})

		const { user } = await sut.execute({ ...authUser })

		expect(user.id).toEqual(expect.any(String))
	})
})
