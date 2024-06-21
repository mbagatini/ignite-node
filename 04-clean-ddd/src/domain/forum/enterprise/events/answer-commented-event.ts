import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type DomainEvent } from '@/core/events/domain-event'
import { type Answer } from '../entities/answer'
import { type AnswerComment } from '../entities/answer-comment'

export class AnswerCommentedEvent implements DomainEvent {
    public readonly ocurredAt: Date
    public readonly answer: Answer
    public readonly comment: AnswerComment

    constructor(answer: Answer, comment: AnswerComment) {
        this.ocurredAt = new Date()
        this.answer = answer
        this.comment = comment
    }

    public getAggregateId(): UniqueEntityID {
        return this.answer.id
    }
}
