import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function metrics(request: FastifyRequest, response: FastifyReply) {
	const userId = request.user.sub

	const userMetricsUseCase = makeGetUserMetricsUseCase()

	const metrics = await userMetricsUseCase.execute({ userId })

	return response.status(200).send(metrics)
}
