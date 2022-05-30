import { Router } from 'express';

import { createSpecificationController } from "../modules/cars/useCases/createSpecification";
import { listSpecificationsController } from "../modules/cars/useCases/listSpecifications";

export const specificationRouter = Router();

specificationRouter.get('/', (req, res) => {
	return listSpecificationsController.handle(req, res);
})

specificationRouter.post('/', (req, res) => {
	return createSpecificationController.handle(req, res);
})