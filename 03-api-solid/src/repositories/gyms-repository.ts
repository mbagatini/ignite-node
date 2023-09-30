import { Gym, GymCreation } from '@/dto/gym'

export interface FindManyNearbyParams {
	latitude: number
	longitude: number
}

export interface GymsRepository {
	create(data: GymCreation): Promise<Gym>
	findById(id: string): Promise<Gym | null>
	findMany(query: string, page: number): Promise<Gym[]>
	findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
}
