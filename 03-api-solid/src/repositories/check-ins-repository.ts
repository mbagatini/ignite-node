import { CheckIn, CheckInCreation } from '@/dto/check-in'

export interface CheckInsRepository {
	create(data: CheckInCreation): Promise<CheckIn>
}
