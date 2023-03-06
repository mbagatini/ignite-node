import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import request from 'supertest'

import { app } from '../src/app'

describe('Transactions - ', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should create a new transaction', async () => {
        const response = await request(app.server).post('/transactions').send({
            title: 'Nice freela',
            type: 'credit',
            amount: 1200,
        })

        expect(response.statusCode).toEqual(201)
    })
})
