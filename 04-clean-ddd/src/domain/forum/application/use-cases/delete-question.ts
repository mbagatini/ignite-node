import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { NotFoundError } from '@/core/errors/not-found-error'

interface DeleteQuestionUseCaseRequest {
    authorId: string
    questionId: string
}

export class DeleteQuestionUseCase {
    constructor(private readonly questionsRepository: QuestionsRepository) {}

    async execute({
        questionId,
        authorId,
    }: DeleteQuestionUseCaseRequest): Promise<void> {
        const question = await this.questionsRepository.getById(questionId)

        if (!question) {
            throw new NotFoundError('Question not found')
        }

        if (question.authorId.toString() !== authorId) {
            throw new UnauthorizedError(
                'You are not allowed to delete this question',
            )
        }

        await this.questionsRepository.delete(questionId)
    }
}
