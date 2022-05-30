import { Request, Response } from 'express';

import { ListSpecificationsUseCase } from "./ListSpecificationsUseCase";

class ListSpecificationsController {
	constructor(private useCase: ListSpecificationsUseCase) { }

	handle(request: Request, response: Response) {
		const specifications = this.useCase.execute();

		return response.json(specifications);
	}
}

export { ListSpecificationsController };