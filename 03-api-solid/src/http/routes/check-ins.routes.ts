import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import { validate } from '../controllers/check-ins/validate'
import { metrics } from '../controllers/check-ins/metrics'
import { history } from '../controllers/check-ins/history'
import { create } from '../controllers/check-ins/create'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function checkInsRoutes(app: FastifyInstance) {
	/** must be authenticated */
	app.addHook('onRequest', verifyJwt)

	app.post('/gyms/:gymId/check-in', create)
	app.patch(
		'/check-ins/:checkInId/validate',
		{ onRequest: [verifyUserRole('ADMIN')] },
		validate,
	)
	app.get('/check-ins/metrics', metrics)
	app.get('/check-ins/history', history)
}
