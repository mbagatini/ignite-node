import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '@/use-cases/register'

export async function register(
	request: FastifyRequest,
	response: FastifyReply,
) {
	const parseUserBody = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
	})

	const { name, email, password } = parseUserBody.parse(request.body)

	const user = {
		name,
		email,
		password,
	}

	const prismaRepository = new PrismaUsersRepository()
	const registerUseCase = new RegisterUseCase(prismaRepository)

	await registerUseCase.execute(user)

	response.status(201).send()
}