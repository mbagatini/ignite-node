import { DomainEvents } from '@/core/events/domain-events'
import { type EventHandler } from '@/core/events/event-handler'
import { type QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import { type SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnswerCreated implements EventHandler {
    constructor(
        private readonly questionRepository: QuestionsRepository,
        private readonly sendNotificationUseCase: SendNotificationUseCase,
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this.sendNewAnswerNotification.bind(this),
            AnswerCreatedEvent.name,
        )
    }

    private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
        const question = await this.questionRepository.getById(
            answer.questionId.toString(),
        )

        if (!question) {
            return
        }

        await this.sendNotificationUseCase.execute({
            recipientId: question.authorId.toString(),
            title: `Nova resposta para a sua pergunta: ${question.title.substring(0, 30).concat('...')}`,
            content: answer.excerpt,
        })
    }
}
