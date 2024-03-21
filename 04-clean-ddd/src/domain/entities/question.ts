import { Entity } from "../../core/entities/entity"
import { UniqueEntityID } from "../../core/entities/unique-entity-id"
import { Optional } from "../../core/types/optional"
import { Slug } from "./value-objects/slug"

interface QuestionProps {
	title: string
	slug: Slug
	content: string
	authorId: UniqueEntityID
	bestAnswerId?: UniqueEntityID
	createdAt: Date
	updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {
	static create(props: Optional<QuestionProps, 'createdAt'>, id?: UniqueEntityID) {
		const question = new Question({
			...props,
			createdAt: props.createdAt || new Date(),
		}, id);

		return question;
	}

	get title() {
		return this.props.title
	}
	get slug() {
		return this.props.slug
	}
	get content() {
		return this.props.content
	}
	get authorId() {
		return this.props.authorId
	}
	get bestAnswerId() {
		return this.props.bestAnswerId
	}
	get createdAt() {
		return this.props.createdAt
	}
	get updatedAt() {
		return this.props.updatedAt
	}
}