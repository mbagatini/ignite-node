import { CheckIn, CheckInCreation } from '@/dto/check-in'

export interface CheckInsRepository {
	create(data: CheckInCreation): Promise<CheckIn>
	update(data: CheckIn): Promise<CheckIn>
	findById(id: string): Promise<CheckIn | null>
	findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
	findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
	getCountByUserId(userId: string): Promise<number>
}
