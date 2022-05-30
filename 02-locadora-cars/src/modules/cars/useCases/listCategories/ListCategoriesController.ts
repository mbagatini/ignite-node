import { Request, Response } from "express";
import { ListCategoriesUseCase } from "./ListCategoriesUseCase";

class ListCategoriesController {
	private categoryUseCase: ListCategoriesUseCase;

	constructor(categoryUseCase: ListCategoriesUseCase) {
		this.categoryUseCase = categoryUseCase;
	}

	handle(request: Request, response: Response) {
		const categories = this.categoryUseCase.execute();

		return response.json(categories);
	}
}

export { ListCategoriesController };