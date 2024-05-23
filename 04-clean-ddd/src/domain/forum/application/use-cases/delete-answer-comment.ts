import { left, right, type Either } from '@/core/either'
import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { type AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseRequest {
    authorId: string
    commentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
    NotFoundError | UnauthorizedError,
    null
>

export class DeleteAnswerCommentUseCase {
    constructor(
        private readonly answerCommentsRepository: AnswerCommentsRepository,
    ) {}

    async execute({
        commentId,
        authorId,
    }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
        const comment = await this.answerCommentsRepository.getById(commentId)

        if (!comment) {
            return left(new NotFoundError('Comment not found'))
        }

        if (comment.authorId.toString() !== authorId) {
            return left(
                new UnauthorizedError(
                    'You are not allowed to delete this comment',
                ),
            )
        }

        await this.answerCommentsRepository.delete(commentId)

        return right(null)
    }
}
