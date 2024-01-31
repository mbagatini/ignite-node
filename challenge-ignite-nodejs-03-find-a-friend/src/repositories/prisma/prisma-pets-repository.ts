import { type Pet, type PetCreation } from '@/dto/pet'
import { type FindManyProps, type PetsRepository } from '../pets-repository'
import { prisma } from '@/database/prisma'

export class PrismaPetsRepository implements PetsRepository {
    async create(data: PetCreation): Promise<Pet> {
        const pet = await prisma.pet.create({
            data,
        })

        return pet as Pet
    }

    async findById(id: string): Promise<Pet | null> {
        const pet = await prisma.pet.findFirst({
            where: {
                id,
            },
            include: {
                org: true,
            },
        })

        return (pet as Pet) ?? null
    }

    async findMany(filters: FindManyProps): Promise<Pet[]> {
        const { city, size, age } = filters

        const pets = await prisma.pet.findMany({
            where: {
                adopted: false,
                ...(size && { size }),
                ...(age && { age }),
                org: {
                    city: {
                        equals: city,
                    },
                },
            },
            include: {
                org: true,
            },
        })

        return pets as Pet[]
    }
}
