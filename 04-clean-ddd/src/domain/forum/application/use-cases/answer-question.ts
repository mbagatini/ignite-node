import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../../enterprise/entities/answer'

interface AnswerQuestionUseCaseRequest {
    instructorId: string
    questionId: string
    content: string
}

export class AnswerQuestionUseCase {
    constructor(private readonly answersRepository: AnswersRepository) {}

    execute({
        instructorId,
        questionId,
        content,
    }: AnswerQuestionUseCaseRequest) {
        const answer = Answer.create({
            content,
            authorId: new UniqueEntityID(instructorId),
            questionId: new UniqueEntityID(questionId),
        })

        return answer
    }
}
