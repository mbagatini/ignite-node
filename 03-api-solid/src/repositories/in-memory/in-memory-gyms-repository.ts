import { GymCreation, Gym } from '@/dto/gym'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
	private gyms: Gym[] = []

	create(data: GymCreation): Promise<Gym> {
		const gym: Gym = {
			id: randomUUID(),
			...data,
		}

		this.gyms.push(gym)

		return Promise.resolve(gym)
	}

	findById(id: string): Promise<Gym | null> {
		const gym = this.gyms.find((gym) => gym.id === id)

		return Promise.resolve(gym || null)
	}

	findMany(query: string, page: number): Promise<Gym[]> {
		const indexStart = (page - 1) * 20
		const indexEnd = page * 20

		const gyms = this.gyms
			.filter((gym) => gym.title.includes(query))
			.slice(indexStart, indexEnd)

		return Promise.resolve(gyms)
	}

	findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
		const gyms = this.gyms.filter((gym) => {
			const distannce = getDistanceBetweenCoordinates(
				{ ...params },
				{
					latitude: gym.latitude,
					longitude: gym.longitude,
				},
			)

			return distannce <= 10
		})

		return Promise.resolve(gyms)
	}
}
