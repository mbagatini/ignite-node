import { verifyJwt } from "@/middlewares/verify-jwt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod'

import { prisma } from "database/prisma";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import dayjs from "dayjs";

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

	app.get('/:id', async (request: FastifyRequest, response: FastifyReply) => {
		const userId = request.user.sub

		const validateMealParams = z.object({
			id: z.string().uuid()
		})

		const { id } = validateMealParams.parse(request.params)

		const meal = await prisma.meal.findUnique({
			where: { 
				id,
				userId
			 }
		})

		if (!meal) {
			throw new ResourceNotFoundError('Meal not found')
		}

		response.status(200).send(meal)
	})

	app.delete('/:id', async (request: FastifyRequest, response: FastifyReply) => {
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

		await prisma.meal.delete({
			where: { id }
		})

		response.status(204).send()
	})

	app.get('/metrics', async (request: FastifyRequest, response: FastifyReply) => {
		const userId = request.user.sub

		const filters: Record<string, any> = {
			userId
		}

		const validateFilterParams = z.object({
			date: z.coerce.date().optional()
		})

		const params = validateFilterParams.parse(request.query)

		if (params.date) {
			const date = dayjs(params.date)
			const startOfDate = date.startOf('date')
			const endOfDate = date.endOf('date')

			filters.createdAt = {
				gte: startOfDate.toDate(),
				lte: endOfDate.toDate()
			}
		}

		const totalMeals = await prisma.meal.aggregate({
			_count: {
				id: true
			},
			where: filters
		})

		const totalCount = totalMeals._count.id

		const mealsInDiet = await prisma.meal.aggregate({
			_count: {
				id: true
			},
			where: { 
				...filters,
				isInDiet: true
			}
		})

		const onDietCount = mealsInDiet._count.id

		let maxCountDate = params.date

		if (!params.date) {
			const resultMeals = await prisma.meal.groupBy({
				by: ['createdAt'],
				_count: {
					createdAt: true,
				},
				where: filters,
				orderBy: {
					_count: {
						createdAt: 'desc',
					},
				},
				take: 1
			});

			maxCountDate = resultMeals[0].createdAt
		}

		const bestSequence = await prisma.meal.findMany({
			where: {
				userId: filters.userId,
				createdAt: maxCountDate,
			}
		})

		const result = {
			total: totalCount,
			onDiet: onDietCount,
			nonCompliant: totalCount - onDietCount,
			bestSequence
		}

		response.status(200).send(result)
	})
}