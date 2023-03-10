import { User, UserCreation } from '@/dto/user'

export interface UsersRepository {
	create(data: UserCreation): Promise<User>
	findByEmail(email: string): Promise<User | null>
}
