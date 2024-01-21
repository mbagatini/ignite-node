import { type Pet, type PetCreation } from '@/dto/pet'
import { ValidationError } from '@/errors/validation-error'
import { type OrganizationsRepository } from '@/repositories/orgs-repository'
import { type PetsRepository } from '@/repositories/pets-repository'

interface CreatePetUseCaseResponse {
    pet: Pet
}

export class CreatePetUseCase {
    constructor(
        private readonly petsRepository: PetsRepository,
        readonly organizationsRepository: OrganizationsRepository,
    ) {}

    async execute(data: PetCreation): Promise<CreatePetUseCaseResponse> {
        const org = await this.organizationsRepository.findById(data.orgId)

        if (!org) {
            throw new ValidationError('Organization not found')
        }

        const pet = await this.petsRepository.create(data)

        return { pet }
    }
}
