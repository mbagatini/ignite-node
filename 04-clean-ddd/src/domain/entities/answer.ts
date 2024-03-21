import { Entity } from "../../core/entities/entity"
import { UniqueEntityID } from "../../core/entities/unique-entity-id"

interface AnswerProps {
	content: string
	authorId: string
	questionId: UniqueEntityID
	createdAt: Date
	updatedAt?: Date
}

export class Answer extends Entity<AnswerProps> {
	get content() {
		return this.props.content
	}
	get authorId() {
		return this.props.authorId
	}
	get questionId() {
		return this.props.questionId
	}
	get createdAt() {
		return this.props.createdAt
	}
	get updatedAt() {
		return this.props.updatedAt
	}
}