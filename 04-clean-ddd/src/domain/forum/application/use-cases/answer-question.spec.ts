import { expect, test } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'
import { type AnswersRepository } from '../repositories/answers-repository'
import { type Answer } from '../../enterprise/entities/answer'

const fakeAnswersRepository: AnswersRepository = {
    create: async (answer: Answer) => {},
}

test('create an answer', async () => {
    const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)

    const answer = answerQuestion.execute({
        questionId: '1',
        instructorId: '1',
        content: 'Nova resposta',
    })

    expect(answer.content).toEqual('Nova resposta')
})
