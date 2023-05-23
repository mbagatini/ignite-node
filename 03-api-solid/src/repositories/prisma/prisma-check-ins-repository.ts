import { CheckInCreation, CheckIn } from '@/dto/check-in'
import { CheckInsRepository } from '../check-ins-repository'
import { prisma } from '@/database/prisma'

export class PrismaCheckInsRepository implements CheckInsRepository {
	async create(data: CheckInCreation): Promise<CheckIn> {
		return await prisma.checkIn.create({
			data,
		})
	}

	async findByUserIdOnDate(
		userId: string,
		date: Date,
	): Promise<CheckIn | null> {
		return await prisma.checkIn.findFirst({
			where: {
				user_id: userId,
				created_at: date,
			},
		})
	}
}
