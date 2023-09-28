import { CheckInCreation, CheckIn } from '@/dto/check-in'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

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

	findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
		const startOfDate = dayjs(date).startOf('date')
		const endOfDate = dayjs(date).endOf('date')

		const isSameDate = (date: Date) => {
			const checkInDate = dayjs(date)
			return startOfDate.isBefore(date) && endOfDate.isAfter(checkInDate)
		}

		const userCheckIn = this.checkIns.find(
			(checkIn) => checkIn.user_id === userId && isSameDate(checkIn.created_at),
		)

		return Promise.resolve(userCheckIn || null)
	}

	findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
		const indexStart = (page - 1) * 20
		const indexEnd = page * 20

		const userCheckIns = this.checkIns
			.filter((checkIn) => checkIn.user_id === userId)
			.slice(indexStart, indexEnd)

		return Promise.resolve(userCheckIns)
	}

	getCountByUserId(userId: string): Promise<number> {
		const userCheckInsCount = this.checkIns.filter(
			(checkIn) => checkIn.user_id === userId,
		).length

		return Promise.resolve(userCheckInsCount)
	}
}
