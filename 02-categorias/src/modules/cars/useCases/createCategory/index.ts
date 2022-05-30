import { CategoryRepository } from "../../repositories/CategoryRepository";
import { CreateCategoryController } from "./CreateCategoryController";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

const categoryRepository = CategoryRepository.getInstance();

const useCase = new CreateCategoryUseCase(categoryRepository);

export const createCategoryController = new CreateCategoryController(useCase);