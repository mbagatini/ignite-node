import { type FastifyInstance } from 'fastify'
import { create } from '../controllers/pets/create'
import { verifyJwt } from '../middlewares/verify-jwt'
import { getDetails } from '../controllers/pets/get-details'
import { search } from '../controllers/pets/search'

export async function petsRoutes(app: FastifyInstance): Promise<void> {
    /** must be authenticated */
    app.post('/', { onRequest: [verifyJwt] }, create)

    app.get('/:id', getDetails)

    app.get('/', search)
}
