import { type FastifyInstance } from 'fastify'
import { create } from '../controllers/pets/create'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function petsRoutes(app: FastifyInstance): Promise<void> {
    /** must be authenticated */
    app.post('/', { onRequest: [verifyJwt] }, create)
}
