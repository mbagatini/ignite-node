import { config } from 'dotenv'

if (process.env.NODE_ENV === 'test') {
    config({ path: '.env.test' })
} else {
    config()
}

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not found')
}
if (!process.env.DATABASE_CLIENT) {
    throw new Error('DATABASE_CLIENT not found')
}

export const env = {
    DATABASE_CLIENT: process.env.DATABASE_CLIENT,
    DATABASE_URL: process.env.DATABASE_URL,
}
