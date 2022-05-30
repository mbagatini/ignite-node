import fs from 'fs';
import { parse } from 'csv-parse';

import { ICategoryRepository } from "../../repositories/ICategoryRepository";

interface ICategoryData {
	name: string;
	description: string;
}

class ImportCategoriesUseCase {
	constructor(private categoryRepository: ICategoryRepository) { }

	private loadCategories(file: Express.Multer.File): Promise<ICategoryData[]> {
		const stream = fs.createReadStream(file.path);

		const parser = parse();

		stream.pipe(parser);

		const categories: ICategoryData[] = [];

		return new Promise((resolve, reject) => {
			parser.on("data", async (line) => {
				const [name, description] = line;
				categories.push({ name, description });
			}).on("end", () => {
				resolve(categories);
			}).on("error", (err) => {
				reject(err);
			});
		});
	}

	async execute(file: Express.Multer.File) {
		const categories = await this.loadCategories(file);

		categories.forEach((category) => {
			const categoryAlreadyExists = this.categoryRepository.findByName(category.name);

			if (categoryAlreadyExists) {
				return;
			}

			this.categoryRepository.create(category);
		});
	}
}

export { ImportCategoriesUseCase };