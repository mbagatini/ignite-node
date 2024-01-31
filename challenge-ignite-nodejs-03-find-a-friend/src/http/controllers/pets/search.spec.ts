import { app } from '@/app'
import { describe, afterAll, beforeAll, it, expect } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateOrganization } from '@/utils/tests/create-and-authenticate-org'
import { makeCreatePetUseCase } from '@/use-cases/factories/pets/make-create-use-case'

describe('Search Pets (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to search for pets', async () => {
        const { org } = await createAndAuthenticateOrganization(app)

        const createPetUsecase = makeCreatePetUseCase()

        for (let index = 0; index < 5; index++) {
            await createPetUsecase.execute({
                name: 'Pet Name ' + index,
                age: 1,
                size: index % 2 === 0 ? 'small' : 'medium',
                rescuedAt: new Date(),
                adopted: false,
                orgId: org.id,
            })
        }

        const response = await request(app.server).get('/pets').query({
            city: org.city,
        })

        expect(response.statusCode).toEqual(200)
        expect(response.body.pets).toHaveLength(5)
    })
})
