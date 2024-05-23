import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors/not-found-error'
import { makeQuestion } from '@/test/factories/make-question'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { ListQuestionCommentsUseCase } from './list-question-comments'

let inMemoryQuestionCommentsRepository: QuestionCommentsRepository
let inMemoryQuestionRepository: QuestionsRepository
let sut: ListQuestionCommentsUseCase

describe('List Question Comments Use Case', () => {
    beforeEach(() => {
        inMemoryQuestionRepository = new InMemoryQuestionsRepository()
        inMemoryQuestionCommentsRepository =
            new InMemoryQuestionCommentsRepository()

        sut = new ListQuestionCommentsUseCase(
            inMemoryQuestionRepository,
            inMemoryQuestionCommentsRepository,
        )
    })

    test('should throw an error if the question does not exist', async () => {
        const result = await sut.execute({ questionId: 'invalid-id', page: 1 })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotFoundError)
    })

    test('should return the question comments', async () => {
        const question = makeQuestion()
        await inMemoryQuestionRepository.create(question)

        for (const iterator of [1, 2, 3, 4, 5]) {
            const comment = makeQuestionComment({
                questionId: question.id,
                authorId: new UniqueEntityID(`author-${iterator}`),
            })

            await inMemoryQuestionCommentsRepository.create(comment)
        }

        const result = await sut.execute({
            questionId: question.id.toString(),
            page: 1,
        })

        const { comments } = result.rightValue()

        expect(result.isRight()).toBeTruthy()
        expect(comments.length).toBe(5)
    })

    test('should return the list of comments paginated', async () => {
        const question = makeQuestion()
        await inMemoryQuestionRepository.create(question)

        for (let i = 1; i <= 27; i++) {
            const comment = makeQuestionComment({
                questionId: question.id,
                authorId: new UniqueEntityID(`author-${i}`),
            })

            await inMemoryQuestionCommentsRepository.create(comment)
        }

        const result = await sut.execute({
            questionId: question.id.toString(),
            page: 2,
        })

        const { comments } = result.rightValue()

        expect(result.isRight()).toBeTruthy()
        expect(comments.length).toBe(7)
        expect(comments[6].authorId.toString()).toBe('author-27')
    })
})
