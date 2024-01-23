import { makeCreatePetUseCase } from '@/use-cases/factories/pets/make-create-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(
    request: FastifyRequest,
    response: FastifyReply,
): Promise<void> {
    const getBodySchema = z.object({
        name: z.string().min(1).max(255),
        age: z.coerce.number().min(0),
        rescuedAt: z.coerce.date(),
        size: z.enum(['small', 'medium', 'large']),
    })

    const data = getBodySchema.parse(request.body)

    const useCase = makeCreatePetUseCase()

    await useCase.execute({
        ...data,
        adopted: false,
        orgId: request.user.id,
    })

    response.status(201).send()
}
