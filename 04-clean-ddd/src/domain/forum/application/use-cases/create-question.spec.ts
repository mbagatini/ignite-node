import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { CreateQuestionUseCase } from './create-question'

let inMemoryQuestionsRepository: QuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question Use Case', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
    })

    test('should be able to create a question', async () => {
        const result = await sut.execute({
            authorId: '1',
            title: 'Nova pergunta',
            content: 'Conteúdo da pergunta',
        })

        const { question } = result.rightValue()

        expect(result.isRight()).toBeTruthy()
        expect(question.id).toBeTruthy()
    })

    test('should be able to create a question with attachments', async () => {
        const result = await sut.execute({
            authorId: '1',
            title: 'Nova pergunta',
            content: 'Conteúdo da pergunta',
            attachmentIds: ['1', '2'],
        })

        const { question } = result.rightValue()

        expect(result.isRight()).toBeTruthy()
        expect(question.id).toBeTruthy()
        expect(question.attachments.getItems().length).toBe(2)
        expect(question.attachments.getItems()).toEqual([
            expect.objectContaining({ id: new UniqueEntityID('1') }),
            expect.objectContaining({ id: new UniqueEntityID('2') }),
        ])
    })
})
