import { prisma } from '@/database/prisma'
import { env } from '@/env'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { type Environment } from 'vitest'

function generateDatabaseURL(schema: string) {
    const url = new URL(env.DATABASE_URL)

    url.searchParams.set('schema', schema)

    return url.toString()
}

const configuration = {
    name: 'prisma',
    transformMode: 'ssr',
    // before running the tests
    async setup() {
        const uuid = randomUUID()
        const databaseUrl = generateDatabaseURL(uuid)

        console.log('---> Preparing test database: ', databaseUrl)

        // creates a new schema to run e2e tests
        process.env.DATABASE_URL = databaseUrl

        execSync('npx prisma migrate deploy')

        // after all tests
        return {
            async teardown() {
                await prisma.$executeRawUnsafe(
                    `DROP SCHEMA IF EXISTS "${uuid}" CASCADE`,
                )

                await prisma.$disconnect()
            },
        }
    },
}

export default configuration as unknown as Environment
