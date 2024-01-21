import { type Organization } from '@/dto/org'
import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { type OrganizationsRepository } from '@/repositories/orgs-repository'
import { compare } from 'bcryptjs'

interface AuthenticateUseCaseProps {
    username: string
    password: string
}

interface AuthenticateUseCaseResponse {
    org: Organization
}

export class AuthenticateUseCase {
    constructor(private readonly orgsRepository: OrganizationsRepository) {}

    async execute(
        props: AuthenticateUseCaseProps,
    ): Promise<AuthenticateUseCaseResponse> {
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
