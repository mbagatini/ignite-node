import { ValidationError } from "./validation-error";

export class ResourceNotFoundError extends ValidationError {
	constructor(message?: string) {
		super(message || 'Resource not found')
	}
}
