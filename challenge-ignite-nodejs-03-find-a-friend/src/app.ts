import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'
import { AlreadyExistsError } from './errors/already-exists-error'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { fastifyCookie } from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'

export const app = fastify()

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
    sign: {
        expiresIn: '10m',
    },
})

app.register(fastifyCookie)

app.register(appRoutes)

app.setErrorHandler((error, request, response) => {
    if (error instanceof ZodError) {
        return response.status(400).send({
            message: 'Validation error',
            issues: error.issues,
        })
    } else if (error instanceof InvalidCredentialsError) {
        return response.status(400).send(error.message)
    } else if (error instanceof AlreadyExistsError) {
        return response.status(409).send({
            message: error.message,
        })
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error)
    } else {
        // TODO: log error with observability tool (Datadog, Sentry, etc)
    }

    return response.status(500).send('Internal Server Error')
})
