import { CheckIn } from '@/dto/check-in'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface ValidateCheckInUseCaseRequest {
	checkInId: string
}
interface ValidateCheckInUseCaseResponse {
	checkIn: CheckIn
}

export class ValidateCheckInUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute(
		data: ValidateCheckInUseCaseRequest,
	): Promise<ValidateCheckInUseCaseResponse> {
		const { checkInId } = data

		const checkIn = await this.checkInsRepository.findById(checkInId)

		if (!checkIn) {
			throw new ResourceNotFoundError('Check-in not found')
		}

		const updatedCheckIn = await this.checkInsRepository.update({
			...checkIn,
			validated_at: new Date(),
		})

		return {
			checkIn: updatedCheckIn,
		}
	}
}
