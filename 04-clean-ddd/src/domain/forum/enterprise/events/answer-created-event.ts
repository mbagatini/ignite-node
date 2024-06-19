import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type DomainEvent } from '@/core/events/domain-event'
import { type Answer } from '../entities/answer'

export class AnswerCreatedEvent implements DomainEvent {
    public readonly ocurredAt: Date
    public readonly answer: Answer

    constructor(answer: Answer) {
        this.ocurredAt = new Date()
        this.answer = answer
    }

    public getAggregateId(): UniqueEntityID {
        return this.answer.id
    }
}
