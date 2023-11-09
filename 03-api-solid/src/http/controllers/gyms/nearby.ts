import { makeGetNearbyGymsUseCase } from '@/use-cases/factories/make-get-nearby-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function nearby(request: FastifyRequest, response: FastifyReply) {
	const nearbyGymsQuerySchema = z.object({
		latitude: z.coerce.number().refine((value) => {
			return Math.abs(value) <= 90
		}),
		longitude: z.coerce.number().refine((value) => {
			return Math.abs(value) <= 180
		}),
	})

	const data = nearbyGymsQuerySchema.parse(request.query)

	const getNearbyGymUseCase = makeGetNearbyGymsUseCase()

	const { gyms } = await getNearbyGymUseCase.execute({
		userLatitude: data.latitude,
		userLongitude: data.longitude,
	})

	return response.status(200).send({
		gyms,
	})
}
