import { CheckInCreation, CheckIn } from '@/dto/check-in'
import { CheckInsRepository } from '../check-ins-repository'
import { prisma } from '@/database/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
	async create(data: CheckInCreation): Promise<CheckIn> {
		return await prisma.checkIn.create({
			data,
		})
	}

	async update(data: CheckIn): Promise<CheckIn> {
		return await prisma.checkIn.update({
			data,
			where: {
				id: data.id,
			},
		})
	}

	async findById(id: string): Promise<CheckIn | null> {
		const checkIn = await prisma.checkIn.findUnique({
			where: { id },
		})

		return checkIn
	}

	async findByUserIdOnDate(
		userId: string,
		date: Date,
	): Promise<CheckIn | null> {
		const startOfDate = dayjs(date).startOf('date')
		const endOfDate = dayjs(date).endOf('date')

		return await prisma.checkIn.findFirst({
			where: {
				user_id: userId,
				created_at: {
					gte: startOfDate.toDate(),
					lte: endOfDate.toDate(),
				},
			},
		})
	}

	async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
		return await prisma.checkIn.findMany({
			where: {
				user_id: userId,
			},
			take: 20,
			skip: (page - 1) * 20,
		})
	}

	async getCountByUserId(userId: string): Promise<number> {
		return await prisma.checkIn.count({
			where: {
				user_id: userId,
			},
		})
	}
}
