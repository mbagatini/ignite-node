import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

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

	const registerUseCase = makeRegisterUseCase()

	await registerUseCase.execute(user)

	response.status(201).send()
}
