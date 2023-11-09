import { makeGetGymsUseCase } from '@/use-cases/factories/make-get-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function search(request: FastifyRequest, response: FastifyReply) {
	const searchGymsQuerySchema = z.object({
		query: z.string(),
		page: z.coerce.number().min(1).default(1),
	})

	const data = searchGymsQuerySchema.parse(request.query)

	const getGymUseCase = makeGetGymsUseCase()

	const { gyms } = await getGymUseCase.execute({
		...data,
	})

	return response.status(200).send({
		gyms,
	})
}
