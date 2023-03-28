import { FastifyInstance } from 'fastify'
import { sessionRoutes } from './sessions.routes'
import { userRoutes } from './users.routes'

export async function appRoutes(app: FastifyInstance) {
	app.register(userRoutes, {
		prefix: '/users',
	})
	app.register(sessionRoutes, {
		prefix: '/sessions',
	})
}
