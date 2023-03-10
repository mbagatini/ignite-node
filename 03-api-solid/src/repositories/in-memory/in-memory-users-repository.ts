import { Prisma, User } from '@prisma/client'
import { randomUUID } from 'crypto'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
	private users: User[] = []

	create(data: Prisma.UserCreateInput): Promise<User> {
		const user: User = {
			id: randomUUID(),
			name: data.name,
			email: data.email,
			password_hash: data.password_hash,
			created_at: new Date(),
		}

		this.users.push(user)

		return Promise.resolve(user)
	}

	findByEmail(email: string): Promise<User | null> {
		const user = this.users.find((user) => user.email === email)

		return Promise.resolve(user ?? null)
	}
}
