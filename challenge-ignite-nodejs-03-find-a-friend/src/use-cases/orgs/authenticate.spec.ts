import { type OrganizationsRepository } from '@/repositories/orgs-repository'
import { describe, beforeEach, it, expect } from 'vitest'
import { AuhtenticateUseCase } from './authenticate'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'

describe('Authenticate Organization Use Case', () => {
    let orgRepository: OrganizationsRepository
    let sut: AuhtenticateUseCase

    function mountTestUseCase() {
        const orgDetails = {
            name: 'Org Name',
            address: 'Orange Street, 123',
            city: 'São Paulo',
            state: 'SP',
            whatsapp: '5511999999999',
            username: 'org',
            password: '123456',
        }

        const createOrg = async () => {
            const { password, ...details } = orgDetails

            return await orgRepository.create({
                ...details,
                passwordHash: await hash(password, 6),
                createdAt: new Date(),
            })
        }

        return { orgDetails, createOrg }
    }

    beforeEach(() => {
        orgRepository = new InMemoryOrganizationsRepository()
        sut = new AuhtenticateUseCase(orgRepository)
    })

    it('should be able to authenticate an organization', async () => {
        const { createOrg, orgDetails } = mountTestUseCase()

        const { id } = await createOrg()

        const { org } = await sut.execute({
            username: orgDetails.username,
            password: orgDetails.password,
        })

        expect(org.id).toEqual(id)
    })

    it('should throw error if organization does not exists', async () => {
        await expect(
            async () =>
                await sut.execute({
                    username: 'fake',
                    password: 'fake',
                }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should throw error if password is wrong', async () => {
        const { createOrg, orgDetails } = mountTestUseCase()

        await createOrg()

        await expect(
            async () =>
                await sut.execute({
                    username: orgDetails.username,
                    password: 'fakeone',
                }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should throw error if usrname is wrong', async () => {
        const { createOrg, orgDetails } = mountTestUseCase()

        await createOrg()

        await expect(
            async () =>
                await sut.execute({
                    username: 'fake',
                    password: orgDetails.password,
                }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})
