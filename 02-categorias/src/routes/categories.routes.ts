import { Router } from 'express';

import { CategoryRepository } from "../repositories/CategoryRepository";
import { CreateCategoryService } from '../services/CreateCategoryService';

const categoriesRouter = Router();
const categoryRepository = new CategoryRepository();

categoriesRouter.post("/", (req, res) => {
	const { name, description } = req.body;

	const createCategoryService = new CreateCategoryService(categoryRepository);

	try {
		createCategoryService.execute({ name, description });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}

	return res.status(201).send();
});

categoriesRouter.get("/", (req, res) => {
	const categories = categoryRepository.list();

	return res.json(categories);
})

export { categoriesRouter };