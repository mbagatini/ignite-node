import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors/not-found-error'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { type AnswersRepository } from '../repositories/answers-repository'
import { ListAnswerCommentsUseCase } from './list-answer-comments'

let inMemoryAnswerCommentsRepository: AnswerCommentsRepository
let inMemoryAnswerRepository: AnswersRepository
let sut: ListAnswerCommentsUseCase

describe('List Answer Comments Use Case', () => {
    beforeEach(() => {
        inMemoryAnswerRepository = new InMemoryAnswersRepository()
        inMemoryAnswerCommentsRepository =
            new InMemoryAnswerCommentsRepository()

        sut = new ListAnswerCommentsUseCase(
            inMemoryAnswerRepository,
            inMemoryAnswerCommentsRepository,
        )
    })

    test('should throw an error if the answer does not exist', async () => {
        const result = await sut.execute({ answerId: 'invalid-id', page: 1 })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotFoundError)
    })

    test('should return the answer comments', async () => {
        const answer = makeAnswer()
        await inMemoryAnswerRepository.create(answer)

        for (const iterator of [1, 2, 3, 4, 5]) {
            const comment = makeAnswerComment({
                answerId: answer.id,
                authorId: new UniqueEntityID(`author-${iterator}`),
            })

            await inMemoryAnswerCommentsRepository.create(comment)
        }

        const result = await sut.execute({
            answerId: answer.id.toString(),
            page: 1,
        })

        const { comments } = result.rightValue()

        expect(result.isRight()).toBeTruthy()
        expect(comments.length).toBe(5)
    })

    test('should return the list of comments paginated', async () => {
        const answer = makeAnswer()
        await inMemoryAnswerRepository.create(answer)

        for (let i = 1; i <= 27; i++) {
            const comment = makeAnswerComment({
                answerId: answer.id,
                authorId: new UniqueEntityID(`author-${i}`),
            })

            await inMemoryAnswerCommentsRepository.create(comment)
        }

        const result = await sut.execute({
            answerId: answer.id.toString(),
            page: 2,
        })

        const { comments } = result.rightValue()

        expect(result.isRight()).toBeTruthy()
        expect(comments.length).toBe(7)
        expect(comments[6].authorId.toString()).toBe('author-27')
    })
})
