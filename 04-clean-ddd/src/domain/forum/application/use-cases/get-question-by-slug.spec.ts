import { beforeEach, describe, expect, test } from 'vitest'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { NotFoundError } from '@/core/errors/not-found-error'
import { Question } from '../../enterprise/entities/question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionsRepository: QuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question by Slug Use Case', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
    })

    test('should throw error if the question does not exist', async () => {
        await expect(sut.execute('non-existing-slug')).rejects.toThrow(
            NotFoundError,
        )
    })

    test('should return the question if it exists', async () => {
        for (const iterator of [1, 2, 3]) {
            const question = Question.create({
                authorId: new UniqueEntityID(iterator.toString()),
                title: `Nova pergunta ${iterator}`,
                content: 'Conteúdo da pergunta',
            })

            await inMemoryQuestionsRepository.create(question)
        }

        const result = await sut.execute('nova-pergunta-1')

        expect(result.slug.value).toBe('nova-pergunta-1')
    })
})
