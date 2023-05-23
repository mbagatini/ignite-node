import { CheckInCreation, CheckIn } from '@/dto/check-in'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryCheckInsRepository implements CheckInsRepository {
	private checkIns: CheckIn[] = []

	create(data: CheckInCreation): Promise<CheckIn> {
		const checkIn: CheckIn = {
			id: randomUUID(),
			user_id: data.user_id,
			gym_id: data.gym_id,
			created_at: new Date(),
		}

		this.checkIns.push(checkIn)

		return Promise.resolve(checkIn)
	}
}
