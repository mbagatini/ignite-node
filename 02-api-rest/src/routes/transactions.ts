import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
    app.get('/', async (req, res) => {
        const transactions = await knex('transaction').select('*')

        return res.send(transactions)
    })

    app.post('/', async (req, res) => {
        const parseBodyTransaction = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        })

        const { title, amount, type } = parseBodyTransaction.parse(req.body)

        await knex('transaction').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
        })

        return res.status(201).send()
    })
}
