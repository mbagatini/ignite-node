import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { hash } from 'bcryptjs'
import { z } from 'zod'

import { prisma } from "database/prisma";
import { AlreadyExistsError } from "@/errors/already-exists-error";

export async function userRoutes(app: FastifyInstance) {
	app.post('/', async (request: FastifyRequest, response: FastifyReply) => {
		const parseUserBody = z.object({
			name: z.string(),
			username: z.string(),
			password: z.string().min(6)
		})

		const data = parseUserBody.parse(request.body)

		const userExists = await prisma.user.findUnique({
			where: {
				username: data.username
			}
		})

		if (userExists) {
			throw new AlreadyExistsError('Username is already taken')
		}

		const password_hash = await hash(data.password, 6) // 6 rounds of hash algorithm

		await prisma.user.create({
			data: {
				username: data.username,
				name: data.name,
				password: password_hash
			}
		})

		response.status(201).send()
	})
}