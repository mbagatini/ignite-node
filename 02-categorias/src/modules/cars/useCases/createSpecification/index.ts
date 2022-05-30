import { SpecificationRepository } from "../../repositories/SpecificationRepository";
import { CreateSpecificationController } from "./CreateSpecificationController";
import { CreateSpecificationUseCase } from "./CreateSpecificationUseCase";

const specificationRepository = SpecificationRepository.getInstance();

const useCase = new CreateSpecificationUseCase(specificationRepository);

export const createSpecificationController = new CreateSpecificationController(useCase);