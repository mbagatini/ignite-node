import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors/not-found-error'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Slug } from '../../enterprise/entities/value-objects/slug'

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
            const question = makeQuestion({
                authorId: new UniqueEntityID(iterator.toString()),
                slug: Slug.create(`nova-pergunta-${iterator}`),
                title: `Nova pergunta ${iterator}`,
                content: 'Conteúdo da pergunta',
            })

            await inMemoryQuestionsRepository.create(question)
        }

        const result = await sut.execute('nova-pergunta-1')

        expect(result.slug.value).toBe('nova-pergunta-1')
    })
})
