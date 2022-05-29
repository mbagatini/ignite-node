import { Category } from "../model/Category";

export interface ICreateCategoryDTO {
	name: string;
	description: string;
}

export interface ICategoryRepository {
	list(): Category[];
	create({ name, description }: ICreateCategoryDTO): void;
	findByName(name: string): Category | void;
}