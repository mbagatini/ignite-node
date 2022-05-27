import { CategoryRepository } from "../repositories/CategoryRepository";

interface IRequestDTO {
	name: string;
	description: string;
}

class CreateCategoryService {
	// DIP
	private categoryRepository: CategoryRepository;

	constructor(categoryRepository: CategoryRepository) {
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