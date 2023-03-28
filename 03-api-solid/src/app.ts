import { ZodError } from 'zod'
import fastify from 'fastify'

import { appRoutes } from './http/routes'
import { AlreadyExistsError } from './errors/already-exists-error'
import { env } from './env'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, request, response) => {
	if (error instanceof ZodError) {
		return response.status(400).send(`Validation error: ${error.issues}`)
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
