import { app } from '@/app'
import { describe, afterAll, beforeAll, it, expect } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateOrganization } from '@/utils/tests/create-and-authenticate-org'

describe('Create Pet (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should not be able to create a pet if not authenticated', async () => {
        const response = await request(app.server).post('/pets').send({
            name: 'Rex',
            age: 5,
            rescuedAt: '2024-01-22T22:30:01.215Z',
            adopted: false,
            size: 'medium',
        })

        expect(response.statusCode).toEqual(401)
        expect(response.body.message).toEqual('Token is missing')
    })

    it('should be able to create a pet', async () => {
        const { token } = await createAndAuthenticateOrganization(app)

        const response = await request(app.server)
            .post('/pets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Rex',
                age: 5,
                rescuedAt: '2024-01-22T22:30:01.215Z',
                adopted: false,
                size: 'medium',
            })

        expect(response.statusCode).toEqual(201)
    })
})
