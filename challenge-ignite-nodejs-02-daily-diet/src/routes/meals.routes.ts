import { verifyJwt } from "@/middlewares/verify-jwt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod'

import { prisma } from "database/prisma";

export async function mealsRoutes(app: FastifyInstance) {
	/** must be authenticated */
	app.addHook('onRequest', verifyJwt)
	
	app.post('/', async (request: FastifyRequest, response: FastifyReply) => {
		const parseMealBody = z.object({
			name: z.string(),
			description: z.string(),
			createdAt: z.coerce.date(),
			isInDiet: z.boolean()
		})

		const data = parseMealBody.parse(request.body)
		const userId = request.user.sub

		await prisma.meal.create({
			data: {
				name: data.name,
				description: data.description,
				createdAt: data.createdAt,
				isInDiet: data.isInDiet,
				userId
			}
		})

		response.status(201).send()
	})

	app.get('/', async (request: FastifyRequest, response: FastifyReply) => {
		const userId = request.user.sub

		const meals = await prisma.meal.findMany({
			where: {
				userId
			}
		})

		response.status(200).send({ meals })
	})
}