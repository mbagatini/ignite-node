import { type FastifyReply, type FastifyRequest } from 'fastify'

export async function verifyJwt(
    request: FastifyRequest,
    response: FastifyReply,
) {
    try {
        await request.jwtVerify()
    } catch (error) {
        return await response.status(401).send({ message: 'Unauthorized' })
    }
}
