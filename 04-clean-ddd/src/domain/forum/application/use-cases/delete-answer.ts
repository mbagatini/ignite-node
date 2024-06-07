import { left, right, type Either } from '@/core/either'
import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { type AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { type AnswersRepository } from '../repositories/answers-repository'
import { type AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'

interface DeleteAnswerUseCaseRequest {
    authorId: string
    answerId: string
}

type DeleteAnswerUseCaseResponse = Either<
    NotFoundError | UnauthorizedError,
    null
>

export class DeleteAnswerUseCase {
    constructor(
        private readonly answersRepository: AnswersRepository,
        private readonly answersCommentsRepository: AnswerCommentsRepository,
        private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
    ) {}

    async execute({
        answerId,
        authorId,
    }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
        const answer = await this.answersRepository.getById(answerId)

        if (!answer) {
            return left(new NotFoundError('Answer not found'))
        }

        if (answer.authorId.toString() !== authorId) {
            return left(
                new UnauthorizedError(
                    'You are not allowed to delete this answer',
                ),
            )
        }

        await this.answersRepository.delete(answerId)
        await this.answersCommentsRepository.deleteByAnswerId(answerId)
        await this.answerAttachmentsRepository.deleteByAnswerId(answerId)

        return right(null)
    }
}
