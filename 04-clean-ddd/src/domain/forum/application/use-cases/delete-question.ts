import { left, right, type Either } from '@/core/either'
import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { type QuestionsRepository } from '../repositories/questions-repository'

interface DeleteQuestionUseCaseRequest {
    authorId: string
    questionId: string
}

type DeleteQuestionUseCaseResponse = Either<
    NotFoundError | UnauthorizedError,
    null
>

export class DeleteQuestionUseCase {
    constructor(private readonly questionsRepository: QuestionsRepository) {}

    async execute({
        questionId,
        authorId,
    }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
        const question = await this.questionsRepository.getById(questionId)

        if (!question) {
            return left(new NotFoundError('Question not found'))
        }

        if (question.authorId.toString() !== authorId) {
            return left(
                new UnauthorizedError(
                    'You are not allowed to delete this question',
                ),
            )
        }

        await this.questionsRepository.delete(questionId)

        return right(null)
    }
}
