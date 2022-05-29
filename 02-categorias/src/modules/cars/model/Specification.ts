import { v4 as uuid } from 'uuid';

class Specification {
	id: string;
	name: string;
	description: string;
	created_at: Date;

	constructor(name: string, description: string) {
		this.id = uuid();
		this.created_at = new Date();
		this.name = name;
		this.description = description;
	}
}

export { Specification };