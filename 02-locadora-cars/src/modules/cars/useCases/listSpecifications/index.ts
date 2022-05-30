import { SpecificationRepository } from "../../repositories/implementations/SpecificationRepository";
import { ListSpecificationsController } from "./ListSpecificationsController";
import { ListSpecificationsUseCase } from "./ListSpecificationsUseCase";

const specificationRepository = SpecificationRepository.getInstance();

const useCase = new ListSpecificationsUseCase(specificationRepository);

export const listSpecificationsController = new ListSpecificationsController(useCase);