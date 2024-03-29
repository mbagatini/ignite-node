import { type Organization } from './org'

export interface Pet {
    id: string
    name: string
    age: number
    rescuedAt?: Date | null
    size: 'small' | 'medium' | 'large'
    adopted: boolean
    adoptedAt?: Date | null

    orgId: string
    org?: Organization
}

export type PetCreation = Omit<Pet, 'id' | 'org'>
