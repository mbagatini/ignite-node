import { makeRegisteOrganizationUseCase } from '@/use-cases/factories/orgs/make-register-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(
    request: FastifyRequest,
    response: FastifyReply,
): Promise<void> {
    const getBodySchema = z.object({
        name: z.string(),
        username: z.string(),
        password: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string().min(2).max(2),
        whatsapp: z.string().min(10).max(11),
    })

    const data = getBodySchema.parse(request.body)

    const useCase = makeRegisteOrganizationUseCase()

    await useCase.execute(data)

    return await response.status(201).send()
}
