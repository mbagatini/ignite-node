import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { UpdateQuestionUseCase } from './update-question'
import { makeQuestionAttachment } from '@/test/factories/make-question-attachments'

let inMemoryQuestionsRepository: QuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: UpdateQuestionUseCase

describe('Update Question Use Case', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        inMemoryQuestionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository()

        sut = new UpdateQuestionUseCase(
            inMemoryQuestionsRepository,
            inMemoryQuestionAttachmentsRepository,
        )
    })

    test('should throw error if the question does not exist', async () => {
        const result = await sut.execute({
            questionId: 'non-existing-slug',
            authorId: '1',
            title: 'title',
            content: 'content',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotFoundError)
    })

    test('should not be able to update a question from another user', async () => {
        const question = makeQuestion(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('question-id'),
        )

        await inMemoryQuestionsRepository.create(question)

        const result = await sut.execute({
            questionId: 'question-id',
            authorId: '2',
            title: 'Example',
            content: 'Some content to the question',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(UnauthorizedError)
    })

    test('should be able to update the question if it exists', async () => {
        const question = makeQuestion(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('question-1'),
        )

        await inMemoryQuestionsRepository.create(question)

        const result = await sut.execute({
            questionId: 'question-1',
            authorId: '1',
            title: 'Poem',
            content: 'Roses are red, violets are blue',
        })

        const { question: updatedQuestion } = result.rightValue()

        expect(result.isRight()).toBeTruthy()
        expect(updatedQuestion).toMatchObject({
            title: 'Poem',
            content: 'Roses are red, violets are blue',
        })
    })

    test('should be able to update the question attachments', async () => {
        const question = makeQuestion(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('question-1'),
        )

        await inMemoryQuestionsRepository.create(question)

        const attachments = ['1', '2'].map((attachmentId) => {
            return makeQuestionAttachment(
                {
                    questionId: question.id,
                    link: `attachment-${attachmentId}`,
                    title: `attachment-${attachmentId}`,
                },
                new UniqueEntityID(attachmentId),
            )
        })

        inMemoryQuestionAttachmentsRepository.attachments.push(...attachments)

        const result = await sut.execute({
            questionId: 'question-1',
            authorId: '1',
            title: 'Poem',
            content: 'Roses are red, violets are blue',
            attachmentIds: ['2', '3'],
        })

        const { question: updatedQuestion } = result.rightValue()

        const attachmentsAfterUpdate = updatedQuestion.attachments.getItems()

        expect(result.isRight()).toBeTruthy()
        expect(attachmentsAfterUpdate.length).toBe(2)
        expect(attachmentsAfterUpdate).toEqual([
            expect.objectContaining({ id: new UniqueEntityID('2') }),
            expect.objectContaining({ id: new UniqueEntityID('3') }),
        ])
    })
})
