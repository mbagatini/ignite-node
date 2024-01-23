import { makeRegisteOrganizationUseCase } from '@/use-cases/factories/orgs/make-register-use-case'
import { type FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateOrganization(app: FastifyInstance) {
    const registerUseCase = makeRegisteOrganizationUseCase()

    const org = {
        name: 'Fake Org Name',
        address: 'Orange Street, 123',
        city: 'São Paulo',
        state: 'SP',
        whatsapp: '11999999999',
        username: 'fakeorg',
        password: '123456',
    }

    await registerUseCase.execute(org)

    const { body } = await request(app.server).post('/auth').send({
        username: 'fakeorg',
        password: '123456',
    })

    return { org, token: body.token }
}
