import { Request, Response } from 'express';
import { ImportCategoriesUseCase } from "./ImportCategoriesUseCase";

class ImportCategoriesController {
	constructor(private useCaseCategory: ImportCategoriesUseCase) { }

	async handle(request: Request, response: Response) {
		const { file } = request;

		await this.useCaseCategory.execute(file);

		return response.status(201).send();
	}
}

export { ImportCategoriesController };