import { type AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { type AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { type QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { UpdateAnswerUseCase } from '@/domain/forum/application/use-cases/update-answer'
import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { type NotificationsRepository } from '../repositories/notifications-repository'
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'
import { makeQuestion } from '@/test/factories/make-question'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'

let inMemoryQuestionsRepository: QuestionsRepository
let inMemoryAnswersRepository: AnswersRepository
let inMemoryAnswerAttachmentsRepository: AnswerAttachmentsRepository
let inMemoryNotificationsRepository: NotificationsRepository

let sendNotificationUseCase: SendNotificationUseCase

describe('On Answer Created Subscriber', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        inMemoryAnswerAttachmentsRepository =
            new InMemoryAnswerAttachmentsRepository()
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

        sendNotificationUseCase = new SendNotificationUseCase(
            inMemoryNotificationsRepository,
        )
    })

    test('should send a notification when an answer is created', async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const subscriber = new OnAnswerCreated(
            inMemoryQuestionsRepository,
            sendNotificationUseCase,
        )

        const sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)

        const notificationSpy = vi.spyOn(sendNotificationUseCase, 'execute')

        const question = makeQuestion()
        const answer = makeAnswer({ questionId: question.id })

        await inMemoryQuestionsRepository.create(question)

        const response = await sut.execute({
            instructorId: answer.authorId.toString(),
            questionId: answer.questionId.toString(),
            content: answer.content,
            attachmentIds: [],
        })

        expect(response.isRight()).toBeTruthy()

        await vi.waitFor(() => {
            expect(notificationSpy).toHaveBeenCalled()
        })
    })

    test('should send a notification when an answer is updated', async () => {
        const notificationSpy = vi.spyOn(sendNotificationUseCase, 'execute')

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const subscriber = new OnAnswerCreated(
            inMemoryQuestionsRepository,
            sendNotificationUseCase,
        )

        const sut = new UpdateAnswerUseCase(
            inMemoryAnswersRepository,
            inMemoryAnswerAttachmentsRepository,
        )

        const question = makeQuestion()
        const answer = makeAnswer({ questionId: question.id })

        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)

        const response = await sut.execute({
            answerId: answer.id.toString(),
            authorId: answer.authorId.toString(),
            content: 'New content',
            attachmentIds: [],
        })

        expect(response.isRight()).toBeTruthy()

        await vi.waitFor(() => {
            expect(notificationSpy).toHaveBeenCalled()
        })
    })
})
