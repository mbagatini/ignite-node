import { Specification } from "../model/Specification";
import { ICreateSpecificationDTO, ISpecificationRepository } from "./ISpecificationRepository";

class SpecificationRepository implements ISpecificationRepository {
	private specification: Specification[];

	constructor() {
		this.specification = [];
	}

	list(): Specification[] {
		return this.specification;
	}

	create({ name, description }: ICreateSpecificationDTO): void {
		const specification = new Specification(name, description);

		this.specification.push(specification);
	}

	findByName(name: string): Specification {
		return this.specification.find(specification => specification.name === name);
	}

}

export { SpecificationRepository };