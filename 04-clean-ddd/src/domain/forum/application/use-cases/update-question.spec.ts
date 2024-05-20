import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { UpdateQuestionUseCase } from './update-question'

let inMemoryQuestionsRepository: QuestionsRepository
let sut: UpdateQuestionUseCase

describe('Update Question Use Case', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new UpdateQuestionUseCase(inMemoryQuestionsRepository)
    })

    test('should throw error if the question does not exist', async () => {
        await expect(
            sut.execute({
                questionId: 'non-existing-slug',
                authorId: '1',
                title: 'title',
                content: 'content',
            }),
        ).rejects.toThrow(NotFoundError)
    })

    test('should not be able to update a question from another user', async () => {
        const question = makeQuestion(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('question-id'),
        )

        await inMemoryQuestionsRepository.create(question)

        await expect(
            sut.execute({
                questionId: 'question-id',
                authorId: '2',
                title: 'Example',
                content: 'Some content to the question',
            }),
        ).rejects.toThrow(UnauthorizedError)
    })

    test('should update the question if it exists', async () => {
        const question = makeQuestion(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('question-1'),
        )

        await inMemoryQuestionsRepository.create(question)

        const { question: updatedQuestion } = await sut.execute({
            questionId: 'question-1',
            authorId: '1',
            title: 'Poem',
            content: 'Roses are red, violets are blue',
        })

        expect(updatedQuestion).toMatchObject({
            title: 'Poem',
            content: 'Roses are red, violets are blue',
        })
    })
})
