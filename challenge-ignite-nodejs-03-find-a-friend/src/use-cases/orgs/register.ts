import { type Organization, type OrganizationCreation } from '@/dto/org'
import { AlreadyExistsError } from '@/errors/already-exists-error'
import { type OrganizationsRepository } from '@/repositories/orgs-repository'
import { hash } from 'bcryptjs'

type RegisterUseCaseRequest = Omit<
    OrganizationCreation,
    'passwordHash' | 'createdAt'
> & {
    password: string
}

interface RegisterUseCaseResponse {
    org: Organization
}

export class RegisterUseCase {
    constructor(private readonly orgsRepository: OrganizationsRepository) {}

    async execute(
        data: RegisterUseCaseRequest,
    ): Promise<RegisterUseCaseResponse> {
        const orgAlreadyExists = await this.orgsRepository.findByUsername(
            data.username,
        )

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (orgAlreadyExists)
            throw new AlreadyExistsError('Username already in use')

        const { password, ...rest } = data
        const passwordHash = await hash(data.password, 6) // 6 rounds of hash algorithm

        const org = await this.orgsRepository.create({
            ...rest,
            passwordHash,
            createdAt: new Date(),
        })

        return { org }
    }
}
