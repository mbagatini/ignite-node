import { prisma } from '@/database/prisma'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'

function generateDatabaseURL(schema: string) {
	if (!process.env.DATABASE_URL) {
		throw Error('Please provide the DATABASE_URL environment variable')
	}

	const url = new URL(process.env.DATABASE_URL)

	url.searchParams.set('schema', schema)

	return url.toString()
}

export default <Environment>{
	name: 'prisma',
	// before running the tests
	async setup() {
		const uuid = randomUUID()
		const databaseUrl = generateDatabaseURL(uuid)

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
