import { Router } from 'express';

import { CategoryRepository } from "../repositories/CategoryRepository";

const categoriesRouter = Router();
const categoryRepository = new CategoryRepository();

categoriesRouter.post("/", (req, res) => {
	const { name, description } = req.body;

	categoryRepository.create({ name, description });

	return res.status(201).send();
});

categoriesRouter.get("/", (req, res) => {
	const categories = categoryRepository.list();

	return res.json(categories);
})

export { categoriesRouter };