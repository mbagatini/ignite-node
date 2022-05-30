import { Specification } from "../../model/Specification";
import { SpecificationRepository } from "../../repositories/SpecificationRepository";

class ListSpecificationsUseCase {
	constructor(private repository: SpecificationRepository) { }

	execute(): Specification[] {
		return this.repository.list();
	}
}

export { ListSpecificationsUseCase };