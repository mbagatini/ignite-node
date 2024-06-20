import { DomainEvents } from '@/core/events/domain-events'
import { type EventHandler } from '@/core/events/event-handler'
import { type AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen'
import { type SendNotificationUseCase } from '../use-cases/send-notification'

export class OnQuestionBestAnswerChosen implements EventHandler {
    constructor(
        private readonly answersRepository: AnswersRepository,
        private readonly sendNotificationUseCase: SendNotificationUseCase,
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this.sendQuestionBestAnswerNotification.bind(this),
            QuestionBestAnswerChosenEvent.name,
        )
    }

    private async sendQuestionBestAnswerNotification({
        question,
        bestAnswerId,
    }: QuestionBestAnswerChosenEvent) {
        const answer = await this.answersRepository.getById(
            bestAnswerId.toString(),
        )

        if (!answer) {
            return
        }

        await this.sendNotificationUseCase.execute({
            recipientId: answer.authorId.toString(),
            title: 'Sua resposta foi escolhida!',
            content: `A resposta que você deu para a pergunta "${question.title}" foi escolhida pelo autor!`,
        })
    }
}
