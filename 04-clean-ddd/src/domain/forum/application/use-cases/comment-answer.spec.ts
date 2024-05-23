import { NotFoundError } from '@/core/errors/not-found-error'
import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { type AnswersRepository } from '../repositories/answers-repository'
import { CommentAnswerUseCase } from './comment-answer'

let inMemoryAnswersRepository: AnswersRepository
let inMemoryAnswerCommentsRepository: AnswerCommentsRepository
let sut: CommentAnswerUseCase

describe('Comment on Answer Use Case', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        inMemoryAnswerCommentsRepository =
            new InMemoryAnswerCommentsRepository()
        sut = new CommentAnswerUseCase(
            inMemoryAnswerCommentsRepository,
            inMemoryAnswersRepository,
        )
    })

    test('should throw an error if the answer does not exist', async () => {
        const result = await sut.execute({
            authorId: '1',
            answerId: '1',
            content: 'Lorem ipsum dolor sit amet.',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotFoundError)
    })

    test('should be able to comment on a answer', async () => {
        const answer = makeAnswer()
        await inMemoryAnswersRepository.create(answer)

        const result = await sut.execute({
            authorId: '1',
            answerId: answer.id.toString(),
            content: 'Lorem ipsum dolor sit amet.',
        })

        const { comment } = result.rightValue()

        expect(result.isRight()).toBeTruthy()
        expect(comment.id).toBeTruthy()
    })
})
