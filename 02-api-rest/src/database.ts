import { knex as knexSetup } from 'knex'

export const knex = knexSetup({
    client: 'sqlite3', // or 'better-sqlite3'
    connection: {
        filename: './db.sqlite',
    },
})
