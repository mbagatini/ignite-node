import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, response: FastifyReply) {
	await request.jwtVerify()

	const userId = request.user.sub

	return response.status(200).send(userId)
}
