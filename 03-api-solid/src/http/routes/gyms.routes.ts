import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import { create } from '../controllers/gyms/create'
import { search } from '../controllers/gyms/search'
import { nearby } from '../controllers/gyms/nearby'

export async function gymsRoutes(app: FastifyInstance) {
	/** must be authenticated */
	app.addHook('onRequest', verifyJwt)

	app.post('/', create)
	app.get('/search', search)
	app.get('/nearby', nearby)
}
