import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, response: FastifyReply) {
	await request.jwtVerify({ onlyCookie: true })

	const user = request.user

	const token = await response.jwtSign(
		{
			role: user.role,
		},
		{
			sign: {
				sub: user.sub,
			},
		},
	)

	const refreshToken = await response.jwtSign(
		{
			role: user.role,
		},
		{
			sign: {
				sub: user.sub,
				expiresIn: '7d',
			},
		},
	)

	response
		.status(200)
		.setCookie('refreshToken', refreshToken, {
			path: '/', // entire app
			secure: true,
			sameSite: true, // only accessible in the same app
			httpOnly: true, // not accessible by browser
		})
		.send({ token })
}
