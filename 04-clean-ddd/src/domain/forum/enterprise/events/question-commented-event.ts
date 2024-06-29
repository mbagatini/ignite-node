import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type DomainEvent } from '@/core/events/domain-event'
import { type Question } from '../entities/question'
import { type QuestionComment } from '../entities/question-comment'

export class QuestionCommentedEvent implements DomainEvent {
    public readonly ocurredAt: Date
    public readonly question: Question
    public readonly comment: QuestionComment

    constructor(question: Question, comment: QuestionComment) {
        this.ocurredAt = new Date()
        this.question = question
        this.comment = comment
    }

    public getAggregateId(): UniqueEntityID {
        return this.question.id
    }
}
