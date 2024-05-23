import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let inMemoryAnswerCommentsRepository: AnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment Use Case', () => {
    beforeEach(() => {
        inMemoryAnswerCommentsRepository =
            new InMemoryAnswerCommentsRepository()

        sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
    })

    test('should throw error if the comment does not exist', async () => {
        const result = await sut.execute({
            commentId: 'non-existing',
            authorId: '1',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotFoundError)
    })

    test('should not be able to delete a comment from another user', async () => {
        const comment = makeAnswerComment(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('comment-id'),
        )

        await inMemoryAnswerCommentsRepository.create(comment)

        const result = await sut.execute({
            commentId: 'comment-id',
            authorId: '2',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(UnauthorizedError)
    })

    test('should delete the comment if it exists', async () => {
        const comment = makeAnswerComment(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('comment-id'),
        )

        await inMemoryAnswerCommentsRepository.create(comment)

        const result = await sut.execute({
            commentId: 'comment-id',
            authorId: '1',
        })

        const comments = await inMemoryAnswerCommentsRepository.getAll()

        expect(result.isRight()).toBeTruthy()
        expect(comments).toHaveLength(0)
    })
})
