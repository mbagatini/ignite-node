import { Gym, GymCreation } from '@/dto/gym'

export interface GymsRepository {
	create(data: GymCreation): Promise<Gym>
	findById(id: string): Promise<Gym | null>
}
