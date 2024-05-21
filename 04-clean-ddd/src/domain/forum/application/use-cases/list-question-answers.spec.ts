import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors/not-found-error'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type AnswersRepository } from '../repositories/answers-repository'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { ListQuestionAnswersUseCase } from './list-question-answers'

let inMemoryQuestionsRepository: QuestionsRepository
let inMemoryAnswersRepository: AnswersRepository
let sut: ListQuestionAnswersUseCase

describe('List Question Answers Use Case', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new ListQuestionAnswersUseCase(
            inMemoryQuestionsRepository,
            inMemoryAnswersRepository,
        )
    })

    test('should throw an error if the question does not exist', async () => {
        const promise = sut.execute({ questionId: 'invalid-id', page: 1 })

        await expect(promise).rejects.toThrow(NotFoundError)
    })

    test('should return the most recent questions', async () => {
        const question = makeQuestion()
        await inMemoryQuestionsRepository.create(question)

        for (const iterator of [1, 2, 3, 4, 5]) {
            const answer = makeAnswer({
                questionId: question.id,
                authorId: new UniqueEntityID(`author-${iterator}`),
            })

            await inMemoryAnswersRepository.create(answer)
        }

        const result = await sut.execute({
            questionId: question.id.toString(),
            page: 1,
        })

        expect(result.answers.length).toBe(5)
    })

    test('should return the list of answers paginated', async () => {
        const question = makeQuestion()
        await inMemoryQuestionsRepository.create(question)

        for (let i = 1; i <= 27; i++) {
            const answer = makeAnswer({
                questionId: question.id,
                authorId: new UniqueEntityID(`author-${i}`),
            })

            await inMemoryAnswersRepository.create(answer)
        }

        const result = await sut.execute({
            questionId: question.id.toString(),
            page: 2,
        })

        expect(result.answers.length).toBe(7)
        expect(result.answers[6].authorId.toString()).toBe('author-27')
    })
})
