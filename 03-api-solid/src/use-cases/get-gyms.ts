import { Gym } from '@/dto/gym'
import { GymsRepository } from '@/repositories/gyms-repository'

interface GetGymsUseCaseRequest {
	query: string
	page: number
}

interface GetGymsUseCaseResponse {
	gyms: Gym[]
}

export class GetGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		query,
		page,
	}: GetGymsUseCaseRequest): Promise<GetGymsUseCaseResponse> {
		const gyms = await this.gymsRepository.findMany(query, page)

		return {
			gyms,
		}
	}
}
