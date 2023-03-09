import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'

import { PrismaUsersRepository } from '@/repositories/prisma-users-repository';
import { RegisterUseCase } from '@/use-cases/register'
import { AlreadyExistsError } from '@/errors/already-exists-error';

export async function register(
	request: FastifyRequest,
	response: FastifyReply,
) {
	try {
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
	} catch (error) {
		if (error instanceof ZodError) {
			return response.status(400).send(error.flatten().fieldErrors)
		} else if (error instanceof AlreadyExistsError) {
			return response.status(409).send(error.message)
		}
		
		return response.status(400).send(error)
	}

	response.status(201).send()
}
