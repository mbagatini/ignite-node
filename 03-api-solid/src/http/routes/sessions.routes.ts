import { FastifyInstance } from 'fastify'

import { authenticate } from '@/http/controllers/users/authenticate'
import { profile } from '../controllers/users/profile'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function sessionRoutes(app: FastifyInstance) {
	app.post('/', authenticate)

	/** must be authenticated */
	app.get('/me', { onRequest: [verifyJwt] }, profile)
}
