import { GymCreation, Gym } from '@/dto/gym'
import { GymsRepository } from '../gyms-repository'
import { prisma } from '@/database/prisma'

export class PrismaGymsRepository implements GymsRepository {
	async create(data: GymCreation): Promise<Gym> {
		const gym = await prisma.gym.create({
			data,
		})

		return {
			...gym,
			latitude: Number(data.latitude),
			longitude: Number(data.longitude),
		}
	}

	async findById(id: string): Promise<Gym | null> {
		const gym = await prisma.gym.findUnique({ where: { id } })

		if (!gym) return null

		return {
			...gym,
			latitude: Number(gym.latitude),
			longitude: Number(gym.longitude),
		}
	}

	async findMany(query: string, page: number): Promise<Gym[]> {
		const gyms = await prisma.gym.findMany({
			where: {
				title: {
					contains: query,
				},
			},
			skip: (page - 1) * 20,
			take: 20,
		})

		const records = gyms.map((gym) => ({
			...gym,
			latitude: Number(gym.latitude),
			longitude: Number(gym.longitude),
		}))

		return records
	}
}
