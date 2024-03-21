import { randomUUID } from "node:crypto";

export class Entity<T> {
	private readonly _id: string;
	protected props: T;

	constructor(props: T, id?: string) {
		this._id = id ?? randomUUID();
		this.props = props;
	}

	get id(): string {
		return this._id;
	}
}