import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJwt(
	request: FastifyRequest,
	response: FastifyReply,
) {
	const token = request.headers.authorization;

	if (!token) {
		return response.status(401).send({ message: 'Token is missing' });
	}

	try {
		await request.jwtVerify()
	} catch (error) {
		return response.status(401).send({ message: 'Unauthorized' })
	}
}
