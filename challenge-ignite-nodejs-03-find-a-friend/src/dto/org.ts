export interface Organization {
    id: string
    name: string
    address: string
    city: string
    state: string
    whatsapp: string
    username: string
    passwordHash: string
    createdAt: Date
}

export type OrganizationCreation = Omit<Organization, 'id'>
