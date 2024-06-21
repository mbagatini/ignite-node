import { type AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { type AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { type QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { CommentAnswerUseCase } from '@/domain/forum/application/use-cases/comment-answer'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { type NotificationsRepository } from '../repositories/notifications-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { OnAnswerCommented } from './on-answer-commented'

let inMemoryQuestionsRepository: QuestionsRepository
let inMemoryAnswersRepository: AnswersRepository
let inMemoryAnswerCommentsRepository: AnswerCommentsRepository
let inMemoryNotificationsRepository: NotificationsRepository

let sendNotificationUseCase: SendNotificationUseCase

describe('On Answer Commented Subscriber', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        inMemoryAnswerCommentsRepository =
            new InMemoryAnswerCommentsRepository()
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

        sendNotificationUseCase = new SendNotificationUseCase(
            inMemoryNotificationsRepository,
        )
    })

    test('should send a notification when an answer is commented', async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const subscriber = new OnAnswerCommented(sendNotificationUseCase)

        const sut = new CommentAnswerUseCase(
            inMemoryAnswerCommentsRepository,
            inMemoryAnswersRepository,
        )

        const notificationSpy = vi.spyOn(sendNotificationUseCase, 'execute')

        const question = makeQuestion()
        const answer = makeAnswer({ questionId: question.id })
        const comment = makeAnswerComment({
            answerId: answer.id,
            answer,
        })

        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)

        const response = await sut.execute({
            answerId: answer.id.toString(),
            authorId: comment.authorId.toString(),
            content: comment.content,
        })

        expect(response.isRight()).toBeTruthy()

        await vi.waitFor(() => {
            expect(notificationSpy).toHaveBeenCalled()
        })
    })
})
