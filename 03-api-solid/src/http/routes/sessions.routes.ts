import { FastifyInstance } from 'fastify'

import { authenticate } from '@/http/controllers/authenticate'

export async function sessionRoutes(app: FastifyInstance) {
	app.post('/', (req, res) => authenticate(req, res))
}
