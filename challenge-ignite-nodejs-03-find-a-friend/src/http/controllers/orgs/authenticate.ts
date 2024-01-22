import { makeAuthenticateOrganizationUseCase } from '@/use-cases/factories/orgs/make-authenticate-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(
    request: FastifyRequest,
    response: FastifyReply,
) {
    const getBodySchema = z.object({
        username: z.string(),
        password: z.string(),
    })

    const data = getBodySchema.parse(request.body)

    const useCase = makeAuthenticateOrganizationUseCase()

    const authResponse = await useCase.execute(data)
    const orgAuth = authResponse.org

    const token = await response.jwtSign({
        id: orgAuth.id,
    })

    const refreshToken = await response.jwtSign(
        {
            id: orgAuth.id,
        },
        {
            sign: {
                expiresIn: '7d',
            },
        },
    )

    response
        .status(200)
        .setCookie('refreshToken', refreshToken, {
            path: '/', // entire app
            secure: true,
            sameSite: true, // only accessible in the same app
            httpOnly: true, // not accessible by browser
        })
        .send({ token })
}
