import { Router } from 'express';
import { SpecificationRepository } from '../modules/cars/repositories/SpecificationRepository';
import { createSpecificationController } from "../modules/cars/useCases/createSpecification"

export const specificationRouter = Router();

const specificationRepository = new SpecificationRepository();

specificationRouter.get('/', (req, res) => {
	const specifications = specificationRepository.list();

	return res.json(specifications);
})

specificationRouter.post('/', (req, res) => {
	return createSpecificationController.handle(req, res);
})