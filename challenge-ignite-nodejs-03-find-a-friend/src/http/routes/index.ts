import { type FastifyInstance } from 'fastify'
import { organizationsRoutes } from './orgs-routes'
import { sessionsRoutes } from './sessions-routes'

export async function appRoutes(app: FastifyInstance) {
    app.register(sessionsRoutes)

    app.register(organizationsRoutes, {
        prefix: '/orgs',
    })
}
