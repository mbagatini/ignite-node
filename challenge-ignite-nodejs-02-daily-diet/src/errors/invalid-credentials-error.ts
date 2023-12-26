import { ValidationError } from "./validation-error";

export class InvalidCredentialsError extends ValidationError {
	constructor(message?: string) {
		super(message)
	}
}
