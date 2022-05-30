import { Request, Response } from 'express';
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

class CreateCategoryController {
	private categoryUseCase: CreateCategoryUseCase;

	constructor(categoryUseCase: CreateCategoryUseCase) {
		this.categoryUseCase = categoryUseCase;
	}

	handle(request: Request, response: Response) {
		const { name, description } = request.body;

		try {
			this.categoryUseCase.execute({ name, description });
		} catch (error) {
			return response.status(400).json({ error: error.message });
		}

		return response.status(201).send();
	}
}

export { CreateCategoryController };