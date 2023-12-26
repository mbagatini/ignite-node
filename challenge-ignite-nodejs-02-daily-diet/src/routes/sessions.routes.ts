import { compare } from "bcryptjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod';

import { prisma } from "database/prisma";
import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";

export async function sessionsRoutes(app: FastifyInstance) {
	app.post('/auth', async (request: FastifyRequest, response: FastifyReply) => {
		const parseAuthBody = z.object({
			username: z.string(),
			password: z.string()
		})

		const data = parseAuthBody.parse(request.body)

		const user = await prisma.user.findUnique({
			where: {
				username: data.username
			}
		})

		if (!user) {
			throw new InvalidCredentialsError('Incorrect e-mail or password')
		}

		const passwordMatches = await compare(data.password, user.password)

		if (!passwordMatches) {
			throw new InvalidCredentialsError('Incorrect e-mail or password')
		}

		const token = await response.jwtSign(
			{},
			{
				sign: {
					sub: user.id,
				},
			},
		)
	
		const refreshToken = await response.jwtSign(
			{},
			{
				sign: {
					sub: user.id,
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
	})
}