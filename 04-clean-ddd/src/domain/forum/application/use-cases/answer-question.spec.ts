import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type AnswersRepository } from '../repositories/answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

let inMemoryAnswersRepository: AnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer Question Use Case', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
    })

    test('create an answer', async () => {
        const result = await sut.execute({
            questionId: '1',
            instructorId: '1',
            content: 'Nova resposta',
        })

        const { answer } = result.rightValue()

        expect(result.isRight()).toBeTruthy()
        expect(answer.id).toBeTruthy()
    })
})
