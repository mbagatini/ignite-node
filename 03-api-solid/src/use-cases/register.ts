import { hash } from 'bcryptjs'
import { User } from '@prisma/client'

import { UsersRepository } from '@/repositories/users-repository'
import { AlreadyExistsError } from '@/errors/already-exists-error'

interface RegisterUseCaseRequest {
	name: string
	email: string
	password: string
}

interface RegisterUseCaseResponse {
	user: User
}

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute(
		data: RegisterUseCaseRequest,
	): Promise<RegisterUseCaseResponse> {
		const { name, email, password } = data

		const userExists = await this.usersRepository.findByEmail(email)

		if (userExists) {
			throw new AlreadyExistsError('A user with the e-mail already exists')
		}

		const password_hash = await hash(password, 6) // 6 rounds of hash algorithm

		const user = await this.usersRepository.create({
			name,
			email,
			password_hash,
		})

		return {
			user,
		}
	}
}
