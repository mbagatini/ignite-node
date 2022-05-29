import { Router } from 'express';
import { SpecificationRepository } from '../modules/cars/repositories/SpecificationRepository';
import { CreateSpecificationService } from '../modules/cars/services/CreateSpecificationService';

export const specificationRouter = Router();

const specificationRepository = new SpecificationRepository();

specificationRouter.get('/', (req, res) => {
	const specifications = specificationRepository.list();

	return res.json(specifications);
})

specificationRouter.post('/', (req, res) => {
	const { name, description } = req.body;

	const createSpecificationService = new CreateSpecificationService(specificationRepository);

	try {
		createSpecificationService.execute({ name, description });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}

	return res.status(201).send();
})