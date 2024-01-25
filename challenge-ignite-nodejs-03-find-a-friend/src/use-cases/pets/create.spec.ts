import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { type PetsRepository } from '@/repositories/pets-repository'
import { beforeEach, describe, it, expect } from 'vitest'
import { CreatePetUseCase } from './create'
import { type OrganizationsRepository } from '@/repositories/orgs-repository'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { type PetCreation } from '@/dto/pet'
import { ValidationError } from '@/errors/validation-error'
import { hash } from 'bcryptjs'

describe('Create Pet Use Case', () => {
    let petsRepository: PetsRepository
    let orgsRepository: OrganizationsRepository
    let sut: CreatePetUseCase

    beforeEach(() => {
        orgsRepository = new InMemoryOrganizationsRepository()
        petsRepository = new InMemoryPetsRepository(orgsRepository)
        sut = new CreatePetUseCase(petsRepository, orgsRepository)
    })

    it('should not be able to create a pet not linked to an org', async () => {
        const data: PetCreation = {
            name: 'Rex',
            age: 5,
            rescuedAt: new Date(),
            adopted: false,
            size: 'medium',
            orgId: 'invalid-org-id',
        }

        expect(async () => await sut.execute(data)).rejects.toThrowError(
            ValidationError,
        )
    })

    it('should be able to create a pet', async () => {
        const org = await orgsRepository.create({
            name: 'Org 1',
            address: 'Address 1',
            city: 'City 1',
            state: 'State 1',
            whatsapp: '11999999999',
            username: 'org1',
            passwordHash: await hash('123456', 6),
            createdAt: new Date(),
        })

        const data: PetCreation = {
            name: 'Rex',
            age: 5,
            rescuedAt: new Date(),
            adopted: false,
            size: 'medium',
            orgId: org.id,
        }

        const { pet } = await sut.execute(data)

        expect(pet.id).toEqual(expect.any(String))
    })
})
