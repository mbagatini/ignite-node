import { type Pet } from '@/dto/pet'
import { makeSearchPetUseCase } from '@/use-cases/factories/pets/make-search-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function search(request: FastifyRequest, response: FastifyReply) {
    const getQueryParams = z.object({
        city: z.string(),
        size: z.string().optional(),
        age: z.coerce.number().optional(),
    })

    const filters = getQueryParams.parse(request.query)

    const useCase = makeSearchPetUseCase()

    const pets = await useCase.execute({
        ...filters,
        size: (filters.size as Pet['size']) || undefined,
    })

    response.send({ pets })
}
