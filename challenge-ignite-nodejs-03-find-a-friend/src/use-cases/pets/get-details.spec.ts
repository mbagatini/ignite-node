import { type PetsRepository } from '@/repositories/pets-repository'
import { type OrganizationsRepository } from '@/repositories/orgs-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetPetDetailsUseCase } from './get-details'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { NotFoundError } from '@/errors/not-found-error'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

describe('Get Pet Details Use Case', () => {
    let petsRepository: PetsRepository
    let orgsRepository: OrganizationsRepository
    let sut: GetPetDetailsUseCase

    beforeEach(() => {
        orgsRepository = new InMemoryOrganizationsRepository()
        petsRepository = new InMemoryPetsRepository(orgsRepository)
        sut = new GetPetDetailsUseCase(petsRepository)
    })

    it('should not be able to get details of a non-existing pet', async () => {
        expect(
            async () => await sut.execute({ id: 'non-existing-id' }),
        ).rejects.toBeInstanceOf(NotFoundError)
    })

    it('should be able to get details of a pet', async () => {
        const pet = await petsRepository.create({
            name: 'Pet Name',
            age: 1,
            size: 'small',
            rescuedAt: new Date(),
            adopted: false,
            orgId: 'org-id',
        })

        const response = await sut.execute({ id: pet.id })

        expect(response.pet).toEqual(pet)
    })
})
