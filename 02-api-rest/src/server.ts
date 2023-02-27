import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/', async (req, res) => {
    const transactions = await knex('transaction').select('*')

    return res.send(transactions)
})

app.listen({
    port: 3333,
}).then(() => {
    console.log('--> listening on port 3333')
})
