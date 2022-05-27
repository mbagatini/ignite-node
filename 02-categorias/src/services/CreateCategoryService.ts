import { ICategoryRepository } from "../repositories/ICategoryRepository";

interface IRequestDTO {
	name: string;
	description: string;
}

class CreateCategoryService {
	// DIP and Liskov Substitution Principle
	private categoryRepository: ICategoryRepository;

	constructor(categoryRepository: ICategoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	execute({ name, description }: IRequestDTO): void {
		const categoryAlreadyExists = this.categoryRepository.findByName(name);

		if (categoryAlreadyExists) {
			throw new Error("Category already exists");
		}

		this.categoryRepository.create({ name, description });
	}
}

export { CreateCategoryService };