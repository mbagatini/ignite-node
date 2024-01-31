import { app } from '@/app'
import { describe, afterAll, beforeAll, it, expect } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateOrganization } from '@/utils/tests/create-and-authenticate-org'
import { makeCreatePetUseCase } from '@/use-cases/factories/pets/make-create-use-case'

describe('Get Pet Details (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get a pet by id', async () => {
        const { org } = await createAndAuthenticateOrganization(app)

        const createPetUsecase = makeCreatePetUseCase()

        const { pet } = await createPetUsecase.execute({
            name: 'Pet Name',
            age: 1,
            size: 'small',
            rescuedAt: new Date(),
            adopted: false,
            orgId: org.id,
        })

        const response = await request(app.server).get(`/pets/${pet.id}`)

        expect(response.statusCode).toEqual(200)
        expect(response.body.pet).toEqual(
            expect.objectContaining({
                id: pet.id,
                name: pet.name,
                size: pet.size,
                orgId: pet.orgId,
            }),
        )
    })
})
