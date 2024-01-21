import { type Organization, type OrganizationCreation } from '@/dto/org'

export interface OrganizationsRepository {
    create: (data: OrganizationCreation) => Promise<Organization>
    findById: (id: string) => Promise<Organization | null>
    findByUsername: (username: string) => Promise<Organization | null>
}
