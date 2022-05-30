import { Category } from "../model/Category";
import { ICategoryRepository, ICreateCategoryDTO } from "./ICategoryRepository";

// Liskov Substitution Principle
class CategoryRepository implements ICategoryRepository {
	private categories: Category[];

	// Singleton Pattern
	private static INSTANCE: CategoryRepository;

	public static getInstance(): CategoryRepository {
		if (!CategoryRepository.INSTANCE) {
			CategoryRepository.INSTANCE = new CategoryRepository();
		}

		return CategoryRepository.INSTANCE;

	}

	private constructor() {
		this.categories = [];
	}

	create({ name, description }: ICreateCategoryDTO): void {
		const category = new Category(
			name,
			description,
		);

		this.categories.push(category);
	}

	list(): Category[] {
		return this.categories;
	}

	findByName(name: string): Category | void {
		const category = this.categories.find(
			(category) => category.name === name,
		);

		return category;
	}
}

export { CategoryRepository };