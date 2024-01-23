import { type Pet } from '@/dto/pet'
import { NotFoundError } from '@/errors/not-found-error'
import { type PetsRepository } from '@/repositories/pets-repository'

interface GetPetDetailsUseCaseProps {
    id: string
}

interface GetPetDetailsUseCaseResponse {
    pet: Pet
}

export class GetPetDetailsUseCase {
    constructor(private readonly petsRepository: PetsRepository) {}

    async execute(
        props: GetPetDetailsUseCaseProps,
    ): Promise<GetPetDetailsUseCaseResponse> {
        const { id } = props

        const pet = await this.petsRepository.findById(id)

        if (!pet) {
            throw new NotFoundError('Pet not found')
        }

        return { pet }
    }
}
