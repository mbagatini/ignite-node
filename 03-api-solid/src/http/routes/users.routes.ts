import { FastifyInstance } from 'fastify'

import { register } from '@/http/controllers/register'

export async function userRoutes(app: FastifyInstance) {
	app.post('/', register)
}
