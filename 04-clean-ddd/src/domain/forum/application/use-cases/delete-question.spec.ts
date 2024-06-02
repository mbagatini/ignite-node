import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { makeQuestion } from '@/test/factories/make-question'
import { makeQuestionAttachment } from '@/test/factories/make-question-attachments'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { DeleteQuestionUseCase } from './delete-question'

let inMemoryQuestionsRepository: QuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question Use Case', () => {
    beforeEach(() => {
        inMemoryQuestionCommentsRepository =
            new InMemoryQuestionCommentsRepository()
        inMemoryQuestionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()

        sut = new DeleteQuestionUseCase(
            inMemoryQuestionsRepository,
            inMemoryQuestionCommentsRepository,
            inMemoryQuestionAttachmentsRepository,
        )
    })

    test('should throw error if the question does not exist', async () => {
        const result = await sut.execute({
            questionId: 'non-existing-slug',
            authorId: '1',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotFoundError)
    })

    test('should not be able to delete a question from another user', async () => {
        const question = makeQuestion(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('question-id'),
        )

        await inMemoryQuestionsRepository.create(question)

        const result = await sut.execute({
            questionId: 'question-id',
            authorId: '2',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(UnauthorizedError)
    })

    test('should delete the question if it exists', async () => {
        const question = makeQuestion(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('question-id'),
        )

        await inMemoryQuestionsRepository.create(question)

        const result = await sut.execute({
            questionId: 'question-id',
            authorId: '1',
        })

        const questions = await inMemoryQuestionsRepository.getAll()

        expect(result.isRight()).toBeTruthy()
        expect(questions).toHaveLength(0)
    })

    test('should delete question and its comments and attachments', async () => {
        const question = makeQuestion(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('question-id'),
        )

        await inMemoryQuestionsRepository.create(question)

        // attachments
        for (const iterator of [1, 2, 3, 4, 5]) {
            const comment = makeQuestionComment({
                questionId: question.id,
                authorId: new UniqueEntityID(`author-${iterator}`),
            })

            await inMemoryQuestionCommentsRepository.create(comment)
        }

        // questions
        const questionAttachments = [
            makeQuestionAttachment(
                { questionId: question.id },
                new UniqueEntityID('1'),
            ),
        ]

        inMemoryQuestionAttachmentsRepository.attachments.push(
            ...questionAttachments,
        )

        const result = await sut.execute({
            questionId: question.id.toString(),
            authorId: question.authorId.toString(),
        })

        expect(result.isRight()).toBeTruthy()
        expect(inMemoryQuestionCommentsRepository.comments).toHaveLength(0)
        expect(inMemoryQuestionAttachmentsRepository.attachments).toHaveLength(
            0,
        )
    })
})
