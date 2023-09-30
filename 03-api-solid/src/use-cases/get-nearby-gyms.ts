import { Gym } from '@/dto/gym'
import { GymsRepository } from '@/repositories/gyms-repository'

interface GetNearbyGymsUseCaseRequest {
	userLatitude: number
	userLongitude: number
}

interface GetNearbyGymsUseCaseResponse {
	gyms: Gym[]
}

export class GetNearbyGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		userLatitude,
		userLongitude,
	}: GetNearbyGymsUseCaseRequest): Promise<GetNearbyGymsUseCaseResponse> {
		const gyms = await this.gymsRepository.findManyNearby({
			latitude: userLatitude,
			longitude: userLongitude,
		})

		return {
			gyms,
		}
	}
}
