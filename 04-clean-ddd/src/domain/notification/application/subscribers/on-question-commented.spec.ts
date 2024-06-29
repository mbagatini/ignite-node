import { type QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { type QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { CommentQuestionUseCase } from '@/domain/forum/application/use-cases/comment-question'
import { makeQuestion } from '@/test/factories/make-question'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { type NotificationsRepository } from '../repositories/notifications-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { OnQuestionCommented } from './on-question-commented'

let inMemoryQuestionsRepository: QuestionsRepository
let inMemoryQuestionCommentsRepository: QuestionCommentsRepository
let inMemoryNotificationsRepository: NotificationsRepository

let sendNotificationUseCase: SendNotificationUseCase

describe('On Question Commented Subscriber', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        inMemoryQuestionCommentsRepository =
            new InMemoryQuestionCommentsRepository()
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

        sendNotificationUseCase = new SendNotificationUseCase(
            inMemoryNotificationsRepository,
        )
    })

    test('should send a notification when an question is commented', async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const subscriber = new OnQuestionCommented(sendNotificationUseCase)

        const sut = new CommentQuestionUseCase(
            inMemoryQuestionCommentsRepository,
            inMemoryQuestionsRepository,
        )

        const notificationSpy = vi.spyOn(sendNotificationUseCase, 'execute')

        const question = makeQuestion()
        const comment = makeQuestionComment({
            questionId: question.id,
            question,
        })

        await inMemoryQuestionsRepository.create(question)

        const response = await sut.execute({
            questionId: question.id.toString(),
            authorId: comment.authorId.toString(),
            content: comment.content,
        })

        expect(response.isRight()).toBeTruthy()

        await vi.waitFor(() => {
            expect(notificationSpy).toHaveBeenCalled()
        })
    })
})
