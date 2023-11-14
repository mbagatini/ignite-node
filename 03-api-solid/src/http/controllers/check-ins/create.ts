import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, response: FastifyReply) {
	const createCheckInParamsSchema = z.object({
		gymId: z.string(),
	})

	const createCheckInBodySchema = z.object({
		userLatitude: z.number().refine((value) => {
			return Math.abs(value) <= 90
		}),
		userLongitude: z.number().refine((value) => {
			return Math.abs(value) <= 180
		}),
	})

	const { gymId } = createCheckInParamsSchema.parse(request.params)
	const data = createCheckInBodySchema.parse(request.body)
	const userId = request.user.sub

	const checkInUseCase = makeCheckInUseCase()

	await checkInUseCase.execute({
		userId,
		gymId,
		...data,
	})

	return response.status(201).send()
}
