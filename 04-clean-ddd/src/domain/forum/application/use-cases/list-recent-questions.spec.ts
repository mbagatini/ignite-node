import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { ListRecentQuestionsUseCase } from './list-recent-questions'

let inMemoryQuestionsRepository: QuestionsRepository
let sut: ListRecentQuestionsUseCase

describe('List Recent Questions Use Case', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new ListRecentQuestionsUseCase(inMemoryQuestionsRepository)
    })

    test('should return the most recent questions', async () => {
        for (const iterator of [1, 2, 3, 4, 5]) {
            const question = makeQuestion({
                slug: Slug.create(`question-${iterator}`),
                createdAt: new Date(2023, iterator, 10),
            })

            await inMemoryQuestionsRepository.create(question)
        }

        const result = await sut.execute({ page: 1 })

        expect(result.questions.length).toBe(5)
        expect(result.questions[0].slug.value).toBe('question-5')
        expect(result.questions[4].slug.value).toBe('question-1')
    })

    test('should return paginated list of questions', async () => {
        let month = 7
        let day = 10

        for (let i = 1; i <= 27; i++) {
            const question = makeQuestion({
                slug: Slug.create(`question-${i}`),
                createdAt: new Date(2023, month, day),
            })

            day++
            if (day === 30) {
                day = 10
                month++
            }

            await inMemoryQuestionsRepository.create(question)
        }

        const result = await sut.execute({ page: 2 })

        expect(result.questions.length).toBe(7)
        expect(result.questions[6].slug.value).toBe('question-1')
    })
})
