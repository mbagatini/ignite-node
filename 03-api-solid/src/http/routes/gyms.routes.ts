import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import { create } from '../controllers/gyms/create'
import { search } from '../controllers/gyms/search'
import { nearby } from '../controllers/gyms/nearby'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
	/** must be authenticated */
	app.addHook('onRequest', verifyJwt)

	app.post('/', { onRequest: [verifyUserRole('ADMIN')] }, create)
	app.get('/search', search)
	app.get('/nearby', nearby)
}
