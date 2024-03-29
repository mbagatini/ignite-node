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
	let userAuth

	try {
		const authResponse = await authenticateUseCase.execute(user)
		userAuth = authResponse.user
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return response.status(400).send({ message: error.message })
		}

		throw error
	}

	const token = await response.jwtSign(
		{
			role: userAuth.role,
		},
		{
			sign: {
				sub: userAuth.id,
			},
		},
	)

	const refreshToken = await response.jwtSign(
		{
			role: userAuth.role,
		},
		{
			sign: {
				sub: userAuth.id,
				expiresIn: '7d',
			},
		},
	)

	response
		.status(200)
		.setCookie('refreshToken', refreshToken, {
			path: '/', // entire app
			secure: true,
			sameSite: true, // only accessible in the same app
			httpOnly: true, // not accessible by browser
		})
		.send({ token })
}
