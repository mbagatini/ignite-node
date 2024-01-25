import { type Pet, type PetCreation } from '@/dto/pet'

export interface FindManyProps {
    city: string
    size?: Pet['size']
    age?: number
}

export interface PetsRepository {
    create: (data: PetCreation) => Promise<Pet>
    findById: (id: string) => Promise<Pet | null>
    findMany: (filters: FindManyProps) => Promise<Pet[]>
}
