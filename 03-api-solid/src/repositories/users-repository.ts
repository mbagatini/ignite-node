import { User, UserCreation } from '@/dto/user'

export interface UsersRepository {
	create(data: UserCreation): Promise<User>
	findById(id: string): Promise<User | null>
	findByEmail(email: string): Promise<User | null>
}
