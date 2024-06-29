import { DomainEvents } from '@/core/events/domain-events'
import { type EventHandler } from '@/core/events/event-handler'
import { QuestionCommentedEvent } from '@/domain/forum/enterprise/events/question-commented-event'
import { type SendNotificationUseCase } from '../use-cases/send-notification'

export class OnQuestionCommented implements EventHandler {
    constructor(
        private readonly sendNotificationUseCase: SendNotificationUseCase,
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this.sendNewCommentNotification.bind(this),
            QuestionCommentedEvent.name,
        )
    }

    private async sendNewCommentNotification({
        question,
        comment,
    }: QuestionCommentedEvent) {
        await this.sendNotificationUseCase.execute({
            recipientId: question.authorId.toString(),
            title: `Sua pergunta '${question.excerpt.substring(0, 30).concat('...')}' recebeu um comentário!`,
            content: comment.excerpt,
        })
    }
}
