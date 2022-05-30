import { CategoryRepository } from "../../repositories/implementations/CategoryRepository";
import { ListCategoriesController } from "./ListCategoriesController";
import { ListCategoriesUseCase } from "./ListCategoriesUseCase";

const categoryRepository = CategoryRepository.getInstance();

const categoryUseCase = new ListCategoriesUseCase(categoryRepository);

export const listCategoriesController = new ListCategoriesController(categoryUseCase);