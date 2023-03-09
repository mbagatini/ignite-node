import { FastifyInstance } from 'fastify'
import { userRoutes } from './users.routes'

export async function appRoutes(app: FastifyInstance) {
	app.register(userRoutes, {
		prefix: '/users',
	})
}
