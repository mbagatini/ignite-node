import { type Pet } from '@/dto/pet'
import { ValidationError } from '@/errors/validation-error'
import { type PetsRepository } from '@/repositories/pets-repository'

interface SearchPetsUseCaseProps {
    city: string
    size?: Pet['size']
    age?: number
}

export class SearchPetsUseCase {
    constructor(private readonly petsRepository: PetsRepository) {}

    async execute(filters: SearchPetsUseCaseProps): Promise<Pet[]> {
        if (!filters.city) {
            throw new ValidationError('City is required')
        }

        const pets = await this.petsRepository.findMany(filters)

        return pets
    }
}
