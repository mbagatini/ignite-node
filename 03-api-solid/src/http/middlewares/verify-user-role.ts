import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(desiredRole: 'ADMIN' | 'MEMBER') {
	return async (request: FastifyRequest, response: FastifyReply) => {
		const { role } = request.user

		if (role !== desiredRole) {
			return response.status(401).send({ message: 'Unauthorized' })
		}
	}
}
