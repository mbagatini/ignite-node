import { FastifyInstance } from 'fastify'

import { authenticate } from '@/http/controllers/users/authenticate'
import { refresh } from '../controllers/users/refresh'
import { profile } from '../controllers/users/profile'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function sessionRoutes(app: FastifyInstance) {
	app.post('/', authenticate)

	app.patch('/token/refresh', refresh)

	/** must be authenticated */
	app.get('/me', { onRequest: [verifyJwt] }, profile)
}
