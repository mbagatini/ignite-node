import { Category } from "../../model/Category";
import { ICategoryRepository } from "../../repositories/ICategoryRepository";

class ListCategoriesUseCase {
	// DIP and Liskov Substitution Principle
	private categoryRepository: ICategoryRepository;

	constructor(categoryRepository: ICategoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	execute(): Category[] {
		return this.categoryRepository.list();
	}
}

export { ListCategoriesUseCase };