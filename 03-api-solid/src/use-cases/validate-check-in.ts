import { CheckIn } from '@/dto/check-in'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { ValidationError } from '@/errors/validation-error'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import dayjs from 'dayjs'

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

		const elapsedMinutesFromCreation = dayjs(new Date()).diff(
			checkIn.created_at,
			'minutes',
		)

		if (elapsedMinutesFromCreation > 20) {
			throw new ValidationError('Check-in is expired')
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
