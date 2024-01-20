import { type Organization, type OrganizationCreation } from '@/dto/org'
import { type OrganizationsRepository } from '../orgs-repository'
import { randomUUID } from 'crypto'

export class InMemoryOrganizationsRepository
    implements OrganizationsRepository
{
    private readonly orgs: Organization[] = []

    async create(data: OrganizationCreation): Promise<Organization> {
        const org = {
            ...data,
            id: randomUUID(),
            createAt: new Date(),
        }

        this.orgs.push(org)

        return org
    }

    async findByUsername(username: string): Promise<Organization | null> {
        return this.orgs.find((org) => org.username === username) ?? null
    }
}
