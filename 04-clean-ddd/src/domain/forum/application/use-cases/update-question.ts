import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { type Question } from '../../enterprise/entities/question'

interface UpdateQuestionUseCaseRequest {
    questionId: string
    authorId: string
    title: string
    content: string
}

interface UpdateQuestionUseCaseResponse {
    question: Question
}

export class UpdateQuestionUseCase {
    constructor(private readonly questionsRepository: QuestionsRepository) {}

    async execute({
        questionId,
        authorId,
        title,
        content,
    }: UpdateQuestionUseCaseRequest): Promise<UpdateQuestionUseCaseResponse> {
        const question = await this.questionsRepository.getById(questionId)

        if (!question) {
            throw new NotFoundError('Question not found')
        }

        if (question.authorId.toString() !== authorId) {
            throw new UnauthorizedError(
                'You are not allowed to delete this question',
            )
        }

        question.title = title
        question.content = content

        await this.questionsRepository.update(question)

        return { question }
    }
}
