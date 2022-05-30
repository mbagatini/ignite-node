import { CategoryRepository } from "../../repositories/implementations/CategoryRepository";
import { ImportCategoriesController } from "./ImportCategoriesController";
import { ImportCategoriesUseCase } from "./ImportCategoriesUseCase";

const categoryRepository = CategoryRepository.getInstance();

const useCase = new ImportCategoriesUseCase(categoryRepository);

export const importCategoryController = new ImportCategoriesController(useCase);