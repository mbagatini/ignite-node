import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Authentication (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to authenticate', async () => {
        await request(app.server).post('/orgs').send({
            name: 'Org Name',
            address: 'Orange Street, 123',
            city: 'São Paulo',
            state: 'SP',
            whatsapp: '11999999999',
            username: 'userorg',
            password: '123456',
        })

        const response = await request(app.server).post('/auth').send({
            username: 'userorg',
            password: '123456',
        })

        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual({
            token: expect.any(String),
        })
    })
})
