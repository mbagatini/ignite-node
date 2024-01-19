import { type OrganizationsRepository } from '@/repositories/orgs-repository'
import { describe, beforeEach, it, expect } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { compare } from 'bcryptjs'

describe('Register Organization Use Case', () => {
    let orgRepository: OrganizationsRepository
    let sut: RegisterUseCase

    beforeEach(() => {
        orgRepository = new InMemoryOrganizationsRepository()
        sut = new RegisterUseCase(orgRepository)
    })

    it('should be able to register an organization', async () => {
        const { org } = await sut.execute({
            name: 'Org Name',
            address: 'Orange Street, 123',
            city: 'São Paulo',
            state: 'SP',
            whatsapp: '5511999999999',
            username: 'org',
            password: '123456',
        })

        expect(org.id).toEqual(expect.any(String))
    })

    it('should hash org password on registration', async () => {
        const { org } = await sut.execute({
            name: 'Org Name',
            address: 'Orange Street, 123',
            city: 'São Paulo',
            state: 'SP',
            whatsapp: '5511999999999',
            username: 'org',
            password: '123456',
        })

        const passwordIsHashed = await compare('123456', org.passwordHash)

        expect(passwordIsHashed).toBe(true)
    })

    it('should not be able to register two orgs with same username', async () => {
        await sut.execute({
            name: 'Org Name',
            address: 'Orange Street, 123',
            city: 'São Paulo',
            state: 'SP',
            whatsapp: '5511999999999',
            username: 'org',
            password: '123456',
        })

        expect(async () => {
            await sut.execute({
                name: 'Org Name',
                address: 'Orange Street, 123',
                city: 'São Paulo',
                state: 'SP',
                whatsapp: '5511999999999',
                username: 'org',
                password: '123456',
            })
        }).rejects.toThrow('Username already in use')
    })
})
