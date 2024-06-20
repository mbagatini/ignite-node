import { type AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { type QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { type NotificationsRepository } from '../repositories/notifications-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'

let inMemoryQuestionsRepository: QuestionsRepository
let inMemoryAnswersRepository: AnswersRepository
let inMemoryNotificationsRepository: NotificationsRepository

let sendNotificationUseCase: SendNotificationUseCase

describe('On Question Best Answer Chosen Subscriber', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

        sendNotificationUseCase = new SendNotificationUseCase(
            inMemoryNotificationsRepository,
        )
    })

    test('should send notification when an answer is chosen as question best answer', async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const subscriber = new OnQuestionBestAnswerChosen(
            inMemoryAnswersRepository,
            sendNotificationUseCase,
        )

        const sut = new ChooseQuestionBestAnswerUseCase(
            inMemoryAnswersRepository,
            inMemoryQuestionsRepository,
        )

        const notificationSpy = vi.spyOn(sendNotificationUseCase, 'execute')

        const question = makeQuestion()
        const answer = makeAnswer({ questionId: question.id })

        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)

        const response = await sut.execute({
            answerId: answer.id.toString(),
            authorId: question.authorId.toString(),
        })

        expect(response.isRight()).toBeTruthy()

        await vi.waitFor(() => {
            expect(notificationSpy).toHaveBeenCalled()
        })
    })
})
