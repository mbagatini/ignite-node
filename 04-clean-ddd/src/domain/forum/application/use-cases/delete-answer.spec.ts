import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeAnswerAttachment } from '@/test/factories/make-answer-attachments'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type AnswersRepository } from '../repositories/answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'

let inMemoryAnswersRepository: AnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer Use Case', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        inMemoryAnswerCommentsRepository =
            new InMemoryAnswerCommentsRepository()
        inMemoryAnswerAttachmentsRepository =
            new InMemoryAnswerAttachmentsRepository()

        sut = new DeleteAnswerUseCase(
            inMemoryAnswersRepository,
            inMemoryAnswerCommentsRepository,
            inMemoryAnswerAttachmentsRepository,
        )
    })

    test('should throw error if the answer does not exist', async () => {
        const result = await sut.execute({
            answerId: 'non-existing-slug',
            authorId: '1',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotFoundError)
    })

    test('should not be able to delete a answer from another user', async () => {
        const answer = makeAnswer(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('answer-id'),
        )

        await inMemoryAnswersRepository.create(answer)

        const result = await sut.execute({
            answerId: 'answer-id',
            authorId: '2',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(UnauthorizedError)
    })

    test('should delete the answer if it exists', async () => {
        const answer = makeAnswer(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('answer-id'),
        )

        await inMemoryAnswersRepository.create(answer)

        const result = await sut.execute({
            answerId: 'answer-id',
            authorId: '1',
        })

        const answers = await inMemoryAnswersRepository.getAll()

        expect(result.isRight()).toBeTruthy()
        expect(answers).toHaveLength(0)
    })

    test('should delete the answer and its related entities', async () => {
        const answer = makeAnswer(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('answer-id'),
        )

        await inMemoryAnswersRepository.create(answer)

        // comments
        for (const iterator of [1, 2, 3, 4, 5]) {
            const comment = makeAnswerComment({
                answerId: answer.id,
                authorId: new UniqueEntityID(`author-${iterator}`),
            })

            await inMemoryAnswerCommentsRepository.create(comment)
        }

        // attachments
        const attachments = ['1', '2'].map((attachmentId) => {
            return makeAnswerAttachment(
                {
                    answerId: answer.id,
                    link: `attachment-${attachmentId}`,
                    title: `attachment-${attachmentId}`,
                },
                new UniqueEntityID(attachmentId),
            )
        })

        inMemoryAnswerAttachmentsRepository.attachments.push(...attachments)

        // sut
        const result = await sut.execute({
            answerId: 'answer-id',
            authorId: '1',
        })

        const answers = await inMemoryAnswersRepository.getAll()

        expect(result.isRight()).toBeTruthy()
        expect(answers).toHaveLength(0)

        expect(inMemoryAnswerCommentsRepository.comments).toHaveLength(0)
        expect(inMemoryAnswerAttachmentsRepository.attachments).toHaveLength(0)
    })
})
