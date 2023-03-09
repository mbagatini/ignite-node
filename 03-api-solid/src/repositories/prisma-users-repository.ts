import { prisma } from "@/database/prisma";
import { Prisma } from "@prisma/client";

import { UsersRepository } from "./users-repository";

export class PrismaUsersRepository implements UsersRepository {
	async create(data: Prisma.UserCreateInput) {
		return await prisma.user.create({
			data
		})
	}

	async findByEmail(email: string) {
		return await prisma.user.findFirst({ where: { email } })
	}
}
