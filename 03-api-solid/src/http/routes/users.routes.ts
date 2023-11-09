import { FastifyInstance } from 'fastify'

import { register } from '@/http/controllers/users/register'

export async function userRoutes(app: FastifyInstance) {
	app.post('/', register)
}
