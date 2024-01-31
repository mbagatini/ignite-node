import { type Pet, type PetCreation } from '@/dto/pet'
import { randomUUID } from 'node:crypto'
import { type FindManyProps, type PetsRepository } from '../pets-repository'
import { type OrganizationsRepository } from '../orgs-repository'

export class InMemoryPetsRepository implements PetsRepository {
    private readonly pets: Pet[] = []

    constructor(private readonly orgsRepository: OrganizationsRepository) {}

    async create(data: PetCreation): Promise<Pet> {
        const org = await this.orgsRepository.findById(data.orgId)

        const pet = {
            id: randomUUID(),
            ...data,
            ...(org && { org }),
        }

        this.pets.push(pet)

        return pet
    }

    async findById(id: string): Promise<Pet | null> {
        return this.pets.find((pet) => pet.id === id) ?? null
    }

    async findMany(filters: FindManyProps): Promise<Pet[]> {
        const { city, size, age } = filters

        let pets = this.pets.filter(
            (pet) => pet.org?.city.includes(city) && !pet.adopted,
        )

        if (size) {
            pets = pets.filter((pet) => pet.size === String(size))
        }

        if (age) {
            pets = pets.filter((pet) => pet.age === age)
        }

        return pets
    }
}
