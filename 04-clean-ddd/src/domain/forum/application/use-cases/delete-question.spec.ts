import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { DeleteQuestionUseCase } from './delete-question'

let inMemoryQuestionsRepository: QuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question Use Case', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
    })

    test('should throw error if the question does not exist', async () => {
        await expect(
            sut.execute({ questionId: 'non-existing-slug', authorId: '1' }),
        ).rejects.toThrow(NotFoundError)
    })

    test('should not be able to delete a question from another user', async () => {
        const question = makeQuestion(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('question-id'),
        )

        await inMemoryQuestionsRepository.create(question)

        await expect(
            sut.execute({ questionId: 'question-id', authorId: '2' }),
        ).rejects.toThrow(UnauthorizedError)
    })

    test('should delete the question if it exists', async () => {
        const question = makeQuestion(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('question-id'),
        )

        await inMemoryQuestionsRepository.create(question)

        await sut.execute({ questionId: 'question-id', authorId: '1' })

        const questions = await inMemoryQuestionsRepository.getAll()

        expect(questions).toHaveLength(0)
    })
})
