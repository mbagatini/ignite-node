import { type PetCreation, type Pet } from '@/dto/pet'
import { type PetsRepository } from '../pets-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryPetsRepository implements PetsRepository {
    private readonly pets: Pet[] = []

    async create(data: PetCreation): Promise<Pet> {
        const pet = {
            id: randomUUID(),
            ...data,
        }

        this.pets.push(pet)

        return pet
    }

    async findById(id: string): Promise<Pet | null> {
        return this.pets.find((pet) => pet.id === id) ?? null
    }
}
