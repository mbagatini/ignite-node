import { app } from '@/app'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'
import request from 'supertest'

describe('Organizations (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to register a new organization', async () => {
        const response = await request(app.server).post('/orgs').send({
            name: 'Org Name',
            address: 'Orange Street, 123',
            city: 'São Paulo',
            state: 'SP',
            whatsapp: '5511999999999',
            username: 'org',
            password: '123456',
        })

        expect(response.statusCode).toEqual(201)
    })
})
