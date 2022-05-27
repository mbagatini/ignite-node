import { Category } from "../model/Category";

interface ICreateCategoryDTO {
	name: string;
	description: string;
}

class CategoryRepository {
	private categories: Category[];

	constructor() {
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