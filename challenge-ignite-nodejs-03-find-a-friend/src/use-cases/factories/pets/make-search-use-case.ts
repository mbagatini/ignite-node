import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { SearchPetsUseCase } from '@/use-cases/pets/search'

export function makeSearchPetUseCase() {
    const petsRepository = new PrismaPetsRepository()
    const useCase = new SearchPetsUseCase(petsRepository)

    return useCase
}
