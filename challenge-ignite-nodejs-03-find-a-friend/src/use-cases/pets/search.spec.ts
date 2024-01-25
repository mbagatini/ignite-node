import { type PetCreation } from '@/dto/pet'
import { ValidationError } from '@/errors/validation-error'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { type OrganizationsRepository } from '@/repositories/orgs-repository'
import { type PetsRepository } from '@/repositories/pets-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchPetsUseCase } from './search'

describe('Search Pet Use Case', () => {
    let petsRepository: PetsRepository
    let orgsRepository: OrganizationsRepository
    let sut: SearchPetsUseCase

    beforeEach(() => {
        orgsRepository = new InMemoryOrganizationsRepository()
        petsRepository = new InMemoryPetsRepository(orgsRepository)
        sut = new SearchPetsUseCase(petsRepository)
    })

    it('should not be able to search the pets if city was not informed', async () => {
        const data: PetCreation = {
            name: 'Rex',
            age: 5,
            rescuedAt: new Date(),
            adopted: false,
            size: 'medium',
            orgId: 'invalid-org-id',
        }

        await petsRepository.create(data)

        expect(
            async () => await sut.execute({ city: '' }),
        ).rejects.toThrowError(ValidationError)
    })

    it('should be able to search the pets', async () => {
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

        for (let index = 0; index < 4; index++) {
            const data: PetCreation = {
                name: `Dog ${index}`,
                age: index + 1,
                rescuedAt: new Date(),
                adopted: false,
                size: 'medium',
                orgId: org.id,
            }

            await petsRepository.create(data)
        }

        const pets = await sut.execute({
            city: 'City 1',
        })

        expect(pets).toHaveLength(4)
    })

    it('should be able to search the pets by their characteristics', async () => {
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

        for (let index = 0; index < 4; index++) {
            const data: PetCreation = {
                name: `Dog ${index}`,
                age: index + 1,
                rescuedAt: new Date(),
                adopted: false,
                size: 'medium',
                orgId: org.id,
            }

            await petsRepository.create(data)
        }

        const pets = await sut.execute({
            city: 'City 1',
            age: 2,
            size: 'medium',
        })

        expect(pets).toHaveLength(1)
    })
})
