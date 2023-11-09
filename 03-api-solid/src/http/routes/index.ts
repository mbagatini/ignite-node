import { FastifyInstance } from 'fastify'
import { sessionRoutes } from './sessions.routes'
import { userRoutes } from './users.routes'
import { gymsRoutes } from './gyms.routes'

export async function appRoutes(app: FastifyInstance) {
	app.register(userRoutes, {
		prefix: '/users',
	})
	app.register(sessionRoutes, {
		prefix: '/sessions',
	})
	app.register(gymsRoutes, {
		prefix: '/gyms',
	})
}
