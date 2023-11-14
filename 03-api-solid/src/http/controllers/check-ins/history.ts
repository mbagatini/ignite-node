import { makeGetUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-user-check-ins-history-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function history(request: FastifyRequest, response: FastifyReply) {
	const checkInHistoryInQuerySchema = z.object({
		page: z.coerce.number().default(1),
	})

	const { page } = checkInHistoryInQuerySchema.parse(request.query)

	const userId = request.user.sub

	const userCheckInsHistoryUseCase = makeGetUserCheckInsHistoryUseCase()

	const history = await userCheckInsHistoryUseCase.execute({ userId, page })

	return response.status(200).send(history)
}
