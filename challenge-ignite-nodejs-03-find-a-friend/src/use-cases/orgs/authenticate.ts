import { type Organization } from '@/dto/org'
import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { type OrganizationsRepository } from '@/repositories/orgs-repository'
import { compare } from 'bcryptjs'

interface AuhtenticateUseCaseProps {
    username: string
    password: string
}

interface AuhtenticateUseCaseResponse {
    org: Organization
}

export class AuhtenticateUseCase {
    constructor(private readonly orgsRepository: OrganizationsRepository) {}

    async execute(
        props: AuhtenticateUseCaseProps,
    ): Promise<AuhtenticateUseCaseResponse> {
        const { username, password } = props

        const org = await this.orgsRepository.findByUsername(username)

        if (!org) {
            throw new InvalidCredentialsError('Incorrect email or password')
        }

        const passwordMatch = await compare(password, org.passwordHash)

        if (!passwordMatch) {
            throw new InvalidCredentialsError('Incorrect email or password')
        }

        return { org }
    }
}
