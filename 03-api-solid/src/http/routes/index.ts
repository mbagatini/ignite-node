import { FastifyInstance } from 'fastify'
import { sessionRoutes } from './sessions.routes'
import { userRoutes } from './users.routes'
import { gymsRoutes } from './gyms.routes'
import { checkInsRoutes } from './check-ins.routes'

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
	app.register(checkInsRoutes)
}
