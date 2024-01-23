import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { GetPetDetailsUseCase } from '@/use-cases/pets/get-details'

export function makeGetPetDetailsUseCase() {
    const petsRepository = new PrismaPetsRepository()
    const useCase = new GetPetDetailsUseCase(petsRepository)

    return useCase
}
