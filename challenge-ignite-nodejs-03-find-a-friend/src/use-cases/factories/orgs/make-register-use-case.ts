import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { RegisterUseCase } from '@/use-cases/orgs/register'

export function makeRegisteOrganizationUseCase(): RegisterUseCase {
    const orgsRepository = new InMemoryOrganizationsRepository()
    const registeOrganizationUseCase = new RegisterUseCase(orgsRepository)

    return registeOrganizationUseCase
}
