import { randomUUID } from "node:crypto";

export class UniqueEntityID {
	private readonly value: string;

	get id(): string {
		return this.value;
	}

	constructor(id?: string) {
		this.value = id ?? randomUUID();
	}
}