import { prisma } from '@/database/prisma'
import { UserCreation } from '@/dto/user'

import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
	async create(data: UserCreation) {
		return await prisma.user.create({
			data,
		})
	}

	async findById(id: string) {
		return await prisma.user.findUnique({ where: { id } })
	}

	async findByEmail(email: string) {
		return await prisma.user.findFirst({ where: { email } })
	}
}
