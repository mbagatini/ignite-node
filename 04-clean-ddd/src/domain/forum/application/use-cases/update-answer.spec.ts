import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type AnswersRepository } from '../repositories/answers-repository'
import { UpdateAnswerUseCase } from './update-answer'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from '@/test/factories/make-answer-attachments'

let inMemoryAnswersRepository: AnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: UpdateAnswerUseCase

describe('Update Answer Use Case', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        inMemoryAnswerAttachmentsRepository =
            new InMemoryAnswerAttachmentsRepository()

        sut = new UpdateAnswerUseCase(
            inMemoryAnswersRepository,
            inMemoryAnswerAttachmentsRepository,
        )
    })

    test('should throw error if the answer does not exist', async () => {
        const result = await sut.execute({
            answerId: 'non-existing-slug',
            authorId: '1',
            content: 'content',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotFoundError)
    })

    test('should not be able to update a answer from another user', async () => {
        const answer = makeAnswer(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('answer-id'),
        )

        await inMemoryAnswersRepository.create(answer)

        const result = await sut.execute({
            answerId: 'answer-id',
            authorId: '2',
            content: 'Some content to the answer',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(UnauthorizedError)
    })

    test('should update the answer if it exists', async () => {
        const answer = makeAnswer(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('answer-1'),
        )

        await inMemoryAnswersRepository.create(answer)

        const result = await sut.execute({
            answerId: 'answer-1',
            authorId: '1',
            content: 'Roses are red, violets are blue',
        })

        const { answer: updatedAnswer } = result.rightValue()

        expect(result.isRight()).toBeTruthy()
        expect(updatedAnswer).toMatchObject({
            content: 'Roses are red, violets are blue',
        })
    })

    test('should be able to update the answer attachments', async () => {
        const answer = makeAnswer(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('answer-1'),
        )

        await inMemoryAnswersRepository.create(answer)

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

        const result = await sut.execute({
            answerId: 'answer-1',
            authorId: '1',
            content: 'Roses are red, violets are blue',
            attachmentIds: ['2', '3'],
        })

        const { answer: updatedAnswer } = result.rightValue()

        const attachmentsAfterUpdate = updatedAnswer.attachments.getItems()

        expect(result.isRight()).toBeTruthy()
        expect(attachmentsAfterUpdate.length).toBe(2)
        expect(attachmentsAfterUpdate).toEqual([
            expect.objectContaining({ id: new UniqueEntityID('2') }),
            expect.objectContaining({ id: new UniqueEntityID('3') }),
        ])
    })
})
