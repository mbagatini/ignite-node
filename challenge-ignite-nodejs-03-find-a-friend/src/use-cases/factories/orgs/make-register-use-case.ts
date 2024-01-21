import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { RegisterUseCase } from '@/use-cases/orgs/register'

export function makeRegisteOrganizationUseCase(): RegisterUseCase {
    const orgsRepository = new PrismaOrganizationsRepository()
    const registerOrganizationUseCase = new RegisterUseCase(orgsRepository)

    return registerOrganizationUseCase
}
