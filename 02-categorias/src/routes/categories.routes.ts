import { Router } from 'express';
import { Category } from '../model/Category';

const categoriesRouter = Router();

const categories = <Category[]>[];

categoriesRouter.post("/", (req, res) => {
	const { name, description } = req.body;

	const category = new Category(
		name,
		description,
	);

	categories.push(category);

	return res.status(201).send();
});

export { categoriesRouter };