import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { AuthenticateUseCase } from '@/use-cases/orgs/authenticate'

export function makeAuthenticateOrganizationUseCase(): AuthenticateUseCase {
    const orgsRepository = new PrismaOrganizationsRepository()
    const authenticateOrganizationUseCase = new AuthenticateUseCase(
        orgsRepository,
    )

    return authenticateOrganizationUseCase
}
