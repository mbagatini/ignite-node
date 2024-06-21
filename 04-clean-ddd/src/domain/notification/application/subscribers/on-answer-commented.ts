import { DomainEvents } from '@/core/events/domain-events'
import { type EventHandler } from '@/core/events/event-handler'
import { AnswerCommentedEvent } from '@/domain/forum/enterprise/events/answer-commented-event'
import { type SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnswerCommented implements EventHandler {
    constructor(
        private readonly sendNotificationUseCase: SendNotificationUseCase,
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this.sendNewCommentNotification.bind(this),
            AnswerCommentedEvent.name,
        )
    }

    private async sendNewCommentNotification({
        answer,
        comment,
    }: AnswerCommentedEvent) {
        await this.sendNotificationUseCase.execute({
            recipientId: answer.authorId.toString(),
            title: `Sua resposta '${answer.excerpt.substring(0, 30).concat('...')}' recebeu um comentário!`,
            content: comment.excerpt,
        })
    }
}
