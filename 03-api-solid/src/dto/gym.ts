export type Gym = {
	id: string
	title: string
	description?: string | null
	phone?: string | null
	latitude: number
	longitude: number
}

export type GymCreation = Omit<Gym, 'id'>
