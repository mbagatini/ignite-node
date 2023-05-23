import { CheckIn, CheckInCreation } from '@/dto/check-in'

export interface CheckInsRepository {
	create(data: CheckInCreation): Promise<CheckIn>
	findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}
