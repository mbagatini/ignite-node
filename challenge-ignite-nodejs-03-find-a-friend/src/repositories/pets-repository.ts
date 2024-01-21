import { type Pet, type PetCreation } from '@/dto/pet'

export interface PetsRepository {
    create: (data: PetCreation) => Promise<Pet>
}
