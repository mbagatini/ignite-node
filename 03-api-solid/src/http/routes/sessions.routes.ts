import { FastifyInstance } from 'fastify'

import { authenticate } from '@/http/controllers/authenticate'
import { profile } from '../controllers/profile'

export async function sessionRoutes(app: FastifyInstance) {
	app.post('/', (req, res) => authenticate(req, res))

	/** must be authenticated */
	app.get('/me', (req, res) => profile(req, res))
}
