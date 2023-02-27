import { knex as knexSetup } from 'knex'
import type { Knex } from 'knex'

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not found')
}

export const config: Knex.Config = {
    client: 'sqlite3', // or 'better-sqlite3'
    connection: {
        filename: process.env.DATABASE_URL,
    },
    useNullAsDefault: true,
    migrations: {
        tableName: 'knex_migrations',
        directory: './db/migrations',
    },
}

export const knex = knexSetup(config)
