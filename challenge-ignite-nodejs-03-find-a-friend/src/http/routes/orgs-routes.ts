import { type FastifyInstance } from 'fastify'
import { register } from '../controllers/orgs/register'

export async function organizationsRoutes(app: FastifyInstance): Promise<void> {
    app.post('/', register)
}
