import fastify from 'fastify'
import cookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'

import { mealsRoutes } from './routes/meals.routes'
import { ZodError } from 'zod'
import { ValidationError } from './errors/validation-error'
import { AlreadyExistsError } from './errors/already-exists-error'
import { userRoutes } from './routes/users.routes'
import { sessionsRoutes } from './routes/sessions.routes'

export const app = fastify()

app.register(fastifyJwt, {
	secret: 'desafioignitenode02',
	cookie: {
		cookieName: 'refreshToken',
		signed: false,
	},
	sign: {
		expiresIn: '10m',
	},
})

app.register(cookie)

app.register(userRoutes, { prefix: '/users' })
app.register(sessionsRoutes, { prefix: '/sessions' })
app.register(mealsRoutes, { prefix: '/meals' })

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

	console.error(error)

	return response.status(500).send('Internal Server Error')
})