import { Request, Response } from "express";

import { CreateSpecificationUseCase } from "./CreateSpecificationUseCase";

class CreateSpecificationController {
	private specificationUseCase: CreateSpecificationUseCase;

	constructor(specificationUseCase: CreateSpecificationUseCase) {
		this.specificationUseCase = specificationUseCase;
	}

	handle(request: Request, response: Response) {
		const { name, description } = request.body;

		try {
			this.specificationUseCase.execute({ name, description });
		} catch (error) {
			return response.status(400).json({ error: error.message });
		}

		return response.status(201).send();
	}
}

export { CreateSpecificationController };