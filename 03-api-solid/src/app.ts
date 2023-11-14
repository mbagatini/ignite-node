import { ZodError } from 'zod'
import fastify from 'fastify'

import { appRoutes } from './http/routes'
import { AlreadyExistsError } from './errors/already-exists-error'
import { env } from './env'
import { ValidationError } from './errors/validation-error'
import fastifyJwt from '@fastify/jwt'

export const app = fastify()

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
})

app.register(appRoutes)

app.setErrorHandler((error, request, response) => {
	if (error instanceof ZodError) {
		return response.status(400).send({
			message: 'Validation error',
			issues: error.issues,
		})
	} else if (error instanceof ValidationError) {
		return response.status(400).send(error.message)
	} else if (error instanceof AlreadyExistsError) {
		return response.status(409).send(error.message)
	}

	if (env.NODE_ENV !== 'production') {
		console.error(error)
	} else {
		// TODO: log error with observability tool (Datadog, Sentry, etc)
	}

	return response.status(500).send('Internal Server Error')
})
