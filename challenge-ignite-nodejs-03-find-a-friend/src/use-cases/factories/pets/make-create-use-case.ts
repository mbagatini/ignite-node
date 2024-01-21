import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { CreatePetUseCase } from '@/use-cases/pets/create'

export async function makeCreatePetUseCase() {
    const petsRepository = new PrismaPetsRepository()
    const orgsRepository = new PrismaOrganizationsRepository()
    const createPetUseCase = new CreatePetUseCase(
        petsRepository,
        orgsRepository,
    )

    return createPetUseCase
}
