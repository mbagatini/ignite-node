import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
	app: FastifyInstance,
	isAdmin?: boolean,
) {
	const registerUseCase = makeRegisterUseCase()

	await registerUseCase.execute({
		name: 'John Doe',
		email: 'john@example.com',
		password: '1234567',
		...(isAdmin && { role: 'ADMIN' }),
	})

	const { body } = await request(app.server).post('/sessions').send({
		email: 'john@example.com',
		password: '1234567',
	})

	const { body: userBody } = await request(app.server)
		.get('/sessions/me')
		.set('Authorization', `Bearer ${body.token}`)
		.send()

	return { user: userBody.user, token: body.token }
}
