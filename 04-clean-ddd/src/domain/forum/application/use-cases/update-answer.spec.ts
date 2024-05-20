import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { beforeEach, describe, expect, test } from 'vitest'
import { type AnswersRepository } from '../repositories/answers-repository'
import { UpdateAnswerUseCase } from './update-answer'

let inMemoryAnswersRepository: AnswersRepository
let sut: UpdateAnswerUseCase

describe('Update Answer Use Case', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new UpdateAnswerUseCase(inMemoryAnswersRepository)
    })

    test('should throw error if the answer does not exist', async () => {
        await expect(
            sut.execute({
                answerId: 'non-existing-slug',
                authorId: '1',
                content: 'content',
            }),
        ).rejects.toThrow(NotFoundError)
    })

    test('should not be able to update a answer from another user', async () => {
        const answer = makeAnswer(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('answer-id'),
        )

        await inMemoryAnswersRepository.create(answer)

        await expect(
            sut.execute({
                answerId: 'answer-id',
                authorId: '2',
                content: 'Some content to the answer',
            }),
        ).rejects.toThrow(UnauthorizedError)
    })

    test('should update the answer if it exists', async () => {
        const answer = makeAnswer(
            { authorId: new UniqueEntityID('1') },
            new UniqueEntityID('answer-1'),
        )

        await inMemoryAnswersRepository.create(answer)

        const { answer: updatedAnswer } = await sut.execute({
            answerId: 'answer-1',
            authorId: '1',
            content: 'Roses are red, violets are blue',
        })

        expect(updatedAnswer).toMatchObject({
            content: 'Roses are red, violets are blue',
        })
    })
})
