import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type AnswersRepository } from '../repositories/answers-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: AnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer Question Use Case', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
    })

    test('should be able to create an answer', async () => {
        const result = await sut.execute({
            questionId: '1',
            instructorId: '1',
            content: 'Nova resposta',
        })

        const { answer } = result.rightValue()

        expect(result.isRight()).toBeTruthy()
        expect(answer.id).toBeTruthy()
    })

    test('should be able to create an answer with attachments', async () => {
        const result = await sut.execute({
            questionId: '1',
            instructorId: '1',
            content: 'Conteúdo da resposta',
            attachmentIds: ['1', '2'],
        })

        const { answer } = result.rightValue()

        expect(result.isRight()).toBeTruthy()
        expect(answer.id).toBeTruthy()
        expect(answer.attachments.getItems().length).toBe(2)
        expect(answer.attachments.getItems()).toEqual([
            expect.objectContaining({ id: new UniqueEntityID('1') }),
            expect.objectContaining({ id: new UniqueEntityID('2') }),
        ])
    })
})
