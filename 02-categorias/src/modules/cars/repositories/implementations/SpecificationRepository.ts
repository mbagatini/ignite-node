import { Specification } from "../../model/Specification";
import { ICreateSpecificationDTO, ISpecificationRepository } from "../ISpecificationRepository";

class SpecificationRepository implements ISpecificationRepository {
	// Singleton Design Pattern
	private static INSTANCE: SpecificationRepository;

	public static getInstance(): SpecificationRepository {
		if (!SpecificationRepository.INSTANCE) {
			SpecificationRepository.INSTANCE = new SpecificationRepository();
		}

		return SpecificationRepository.INSTANCE;
	}

	private specification: Specification[];

	private constructor() {
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