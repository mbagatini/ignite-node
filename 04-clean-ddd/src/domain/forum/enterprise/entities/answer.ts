import { AggregateRoot } from '@/core/entities/aggregate-root'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'
import { AnswerCommentedEvent } from '../events/answer-commented-event'
import { AnswerCreatedEvent } from '../events/answer-created-event'
import { AnswerAttachmentList } from './answer-attachment-list'
import { type AnswerComment } from './answer-comment'

export interface AnswerProps {
    content: string
    authorId: UniqueEntityID
    questionId: UniqueEntityID
    attachments?: AnswerAttachmentList
    createdAt: Date
    updatedAt?: Date
}

export class Answer extends AggregateRoot<AnswerProps> {
    static create(
        props: Optional<AnswerProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const answer = new Answer(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )

        const isNewAnswer = !id

        if (isNewAnswer) {
            answer.addDomainEvent(new AnswerCreatedEvent(answer))
        }

        return answer
    }

    get content() {
        return this.props.content
    }

    set content(value: string) {
        this.props.content = value
        this.touch()
    }

    get authorId() {
        return this.props.authorId
    }

    get questionId() {
        return this.props.questionId
    }

    get attachments() {
        return this.props.attachments ?? new AnswerAttachmentList()
    }

    set attachments(attachments: AnswerAttachmentList) {
        this.props.attachments = attachments
        this.touch()
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    get excerpt() {
        return this.content.substring(0, 120).trimEnd().concat('...')
    }

    private touch() {
        this.props.updatedAt = new Date()
    }

    public onCommented(comment: AnswerComment) {
        this.addDomainEvent(new AnswerCommentedEvent(this, comment))
    }
}
