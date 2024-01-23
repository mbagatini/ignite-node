import { type OrganizationCreation, type Organization } from '@/dto/org'
import { type OrganizationsRepository } from '../orgs-repository'
import { prisma } from '@/database/prisma'

export class PrismaOrganizationsRepository implements OrganizationsRepository {
    async create(data: OrganizationCreation): Promise<Organization> {
        return await prisma.organization.create({ data })
    }

    async findById(id: string): Promise<Organization | null> {
        return await prisma.organization.findFirst({ where: { id } })
    }

    async findByUsername(username: string): Promise<Organization | null> {
        return await prisma.organization.findUnique({ where: { username } })
    }
}
