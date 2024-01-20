import { type OrganizationCreation, type Organization } from '@/dto/org'
import { type OrganizationsRepository } from '../orgs-repository'
import { prisma } from '@/database/prisma'

export class PrismaOrganizationsRepository implements OrganizationsRepository {
    async create(data: OrganizationCreation): Promise<Organization> {
        return prisma.organization.create({ data })
    }

    async findByUsername(username: string): Promise<Organization | null> {
        return prisma.organization.findUnique({ where: { username } })
    }
}
