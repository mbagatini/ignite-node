import { type Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { type QuestionsRepository } from '../repositories/questions-repository'

interface CreateQuestionUseCaseRequest {
    authorId: string
    title: string
    content: string
}

type CreateQuestionUseCaseResponse = Either<
    null,
    {
        question: Question
    }
>

export class CreateQuestionUseCase {
    constructor(private readonly questionsRepository: QuestionsRepository) {}

    async execute({
        authorId,
        title,
        content,
    }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
        const question = Question.create({
            title,
            content,
            authorId: new UniqueEntityID(authorId),
        })

        await this.questionsRepository.create(question)

        return right({ question })
    }
}
