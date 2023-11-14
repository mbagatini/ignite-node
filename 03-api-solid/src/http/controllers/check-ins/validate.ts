import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function validate(
	request: FastifyRequest,
	response: FastifyReply,
) {
	const validateCheckInParamsSchema = z.object({
		checkInId: z.string(),
	})

	const { checkInId } = validateCheckInParamsSchema.parse(request.params)

	const validateCheckInUseCase = makeValidateCheckInUseCase()

	await validateCheckInUseCase.execute({ checkInId })

	return response.status(204).send()
}
