import { type Pet, type PetCreation } from '@/dto/pet'
import { type PetsRepository } from '../pets-repository'
import { prisma } from '@/database/prisma'

export class PrismaPetsRepository implements PetsRepository {
    async create(data: PetCreation): Promise<Pet> {
        const pet = await prisma.pet.create({
            data,
        })

        return pet as Pet
    }
}
