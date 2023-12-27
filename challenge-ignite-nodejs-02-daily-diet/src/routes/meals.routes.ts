import { verifyJwt } from "@/middlewares/verify-jwt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod'

import { prisma } from "database/prisma";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";

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
	
	app.post('/:id', async (request: FastifyRequest, response: FastifyReply) => {
		const userId = request.user.sub

		const validateMealParams = z.object({
			id: z.string().uuid()
		})

		const { id } = validateMealParams.parse(request.params)

		const mealExists = await prisma.meal.findUnique({
			where: { 
				id,
				userId
			 }
		})

		if (!mealExists) {
			throw new ResourceNotFoundError('Meal not found')
		}

		const parseMealBody = z.object({
			name: z.string().optional(),
			description: z.string().optional(),
			createdAt: z.coerce.date().optional(),
			isInDiet: z.boolean().optional()
		})

		const data = parseMealBody.parse(request.body)

		await prisma.meal.update({
			data,
			where: { id }
		})

		response.status(204).send()
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