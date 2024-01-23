import { makeGetPetDetailsUseCase } from '@/use-cases/factories/pets/make-get-details-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getDetails(
    request: FastifyRequest,
    response: FastifyReply,
) {
    const getRouteParams = z.object({
        id: z.string().uuid(),
    })

    const { id } = getRouteParams.parse(request.params)

    const useCase = makeGetPetDetailsUseCase()

    const { pet } = await useCase.execute({ id })

    response.send({ pet })
}
