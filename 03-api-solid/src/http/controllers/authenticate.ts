import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(
	request: FastifyRequest,
	response: FastifyReply,
) {
	const parseUserBody = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	})

	const { email, password } = parseUserBody.parse(request.body)

	const user = {
		email,
		password,
	}

	const authenticateUseCase = makeAuthenticateUseCase()

	try {
		await authenticateUseCase.execute(user)
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return response.status(400).send({ message: error.message })
		}

		throw error
	}

	response.status(200).send()
}
