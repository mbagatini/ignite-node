import { type FastifyInstance } from 'fastify'
import { authenticate } from '../controllers/orgs/authenticate'

export async function sessionsRoutes(app: FastifyInstance): Promise<void> {
    app.post('/auth', authenticate)
}
