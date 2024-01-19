import { type FastifyInstance } from 'fastify'
import { organizationsRoutes } from './orgs-routes'

export async function appRoutes(app: FastifyInstance) {
    app.register(organizationsRoutes, {
        prefix: '/orgs',
    })
}
