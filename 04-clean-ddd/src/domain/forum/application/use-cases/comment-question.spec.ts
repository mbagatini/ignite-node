import { NotFoundError } from '@/core/errors/not-found-error'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { CommentQuestionUseCase } from './comment-question'

let inMemoryQuestionsRepository: QuestionsRepository
let inMemoryQuestionCommentsRepository: QuestionCommentsRepository
let sut: CommentQuestionUseCase

describe('Comment Question Use Case', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        inMemoryQuestionCommentsRepository =
            new InMemoryQuestionCommentsRepository()
        sut = new CommentQuestionUseCase(
            inMemoryQuestionCommentsRepository,
            inMemoryQuestionsRepository,
        )
    })

    test('should throw an error if the question does not exist', async () => {
        const promise = sut.execute({
            authorId: '1',
            questionId: '1',
            content: 'Lorem ipsum dolor sit amet.',
        })

        await expect(promise).rejects.toThrow(NotFoundError)
    })

    test('should be able to comment on a question', async () => {
        const question = makeQuestion()
        await inMemoryQuestionsRepository.create(question)

        const { comment } = await sut.execute({
            authorId: '1',
            questionId: question.id.toString(),
            content: 'Lorem ipsum dolor sit amet.',
        })

        expect(comment.id).toBeTruthy()
    })
})
