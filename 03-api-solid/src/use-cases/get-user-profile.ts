import { User } from '@/dto/user'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { UsersRepository } from '@/repositories/users-repository'

interface GetUserProfileUseCaseRequest {
	id: string
}

interface GetUserProfileUseCaseResponse {
	user: User
}

export class GetUserProfileUseCase {
	constructor(private userRepository: UsersRepository) {}

	async execute({
		id,
	}: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
		const user = await this.userRepository.findById(id)

		if (!user) {
			throw new ResourceNotFoundError('User not found')
		}

		return { user }
	}
}
