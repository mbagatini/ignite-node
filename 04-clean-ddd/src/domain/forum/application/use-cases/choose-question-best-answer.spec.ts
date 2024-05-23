import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type AnswersRepository } from '../repositories/answers-repository'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'

let inMemoryQuestionsRepository: QuestionsRepository
let inMemoryAnswersRepository: AnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer Use Case', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new ChooseQuestionBestAnswerUseCase(
            inMemoryAnswersRepository,
            inMemoryQuestionsRepository,
        )
    })

    test('should not be able to choose another user question best answer', async () => {
        const question = makeQuestion(
            { authorId: new UniqueEntityID('author-1') },
            new UniqueEntityID('question-id'),
        )

        await inMemoryQuestionsRepository.create(question)

        const answer = makeAnswer(
            {
                authorId: new UniqueEntityID('author-2'),
                questionId: question.id,
            },
            new UniqueEntityID('answer-1'),
        )

        await inMemoryAnswersRepository.create(answer)

        const result = await sut.execute({
            answerId: answer.id.toString(),
            authorId: 'author-2',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(UnauthorizedError)
    })

    test('should be able to choose the question best answer', async () => {
        const question = makeQuestion(
            { authorId: new UniqueEntityID('author-1') },
            new UniqueEntityID('question-1'),
        )

        await inMemoryQuestionsRepository.create(question)

        const answer = makeAnswer(
            {
                authorId: new UniqueEntityID('author-2'),
                questionId: question.id,
            },
            new UniqueEntityID('answer-1'),
        )

        await inMemoryAnswersRepository.create(answer)

        const result = await sut.execute({
            answerId: answer.id.toString(),
            authorId: question.authorId.toString(),
        })

        const { question: updatedQuestion } = result.rightValue()

        expect(result.isRight()).toBeTruthy()
        expect(updatedQuestion.bestAnswerId).toEqual(answer.id)
    })
})
