import { type Organization, type OrganizationCreation } from '@/dto/org'

export interface OrganizationsRepository {
    create: (data: OrganizationCreation) => Promise<Organization>
    findByUsername: (username: string) => Promise<Organization | undefined>
}
