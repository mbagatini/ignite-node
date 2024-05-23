import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let inMemoryQuestionCommentsRepository: QuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Use Case', () => {
    beforeEach(() => {
        inMemoryQuestionCommentsRepository =
            new InMemoryQuestionCommentsRepository()

        sut = new DeleteQuestionCommentUseCase(
            inMemoryQuestionCommentsRepository,
        )
    })

    test('should throw error if the comment does not exist', async () => {
        await expect(
            sut.execute({ commentId: 'non-existing', authorId: '1' }),
        ).rejects.toThrow(NotFoundError)
    })

    test('should not be able to delete a comment from another user', async () => {
        const comment = makeQuestionComment(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('comment-id'),
        )

        await inMemoryQuestionCommentsRepository.create(comment)

        await expect(
            sut.execute({ commentId: 'comment-id', authorId: '2' }),
        ).rejects.toThrow(UnauthorizedError)
    })

    test('should delete the comment if it exists', async () => {
        const comment = makeQuestionComment(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('comment-id'),
        )

        await inMemoryQuestionCommentsRepository.create(comment)

        await sut.execute({ commentId: 'comment-id', authorId: '1' })

        const comments = await inMemoryQuestionCommentsRepository.getAll()

        expect(comments).toHaveLength(0)
    })
})
