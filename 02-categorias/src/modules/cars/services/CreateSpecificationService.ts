import { ISpecificationRepository } from "../repositories/ISpecificationRepository";

interface IRequestData {
	name: string;
	description: string;
}

class CreateSpecificationService {
	// repository
	private specificationRepository: ISpecificationRepository;

	constructor(specificationRepository: ISpecificationRepository) {
		this.specificationRepository = specificationRepository;
	}

	execute({ name, description }: IRequestData): void {
		const specificationAlreadyExists = this.specificationRepository.findByName(name);

		if (specificationAlreadyExists) {
			throw new Error("Specification already exists");
		}

		this.specificationRepository.create({ name, description });
	}

}

export { CreateSpecificationService };