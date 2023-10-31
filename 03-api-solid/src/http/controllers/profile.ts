import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, response: FastifyReply) {
	const userId = request.user.sub

	const getUserProfile = makeGetUserProfileUseCase()
	const { user } = await getUserProfile.execute({ id: userId })

	return response.status(200).send({
		user: {
			...user,
			password_hash: undefined,
		},
	})
}
