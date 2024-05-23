import { left, right, type Either } from '@/core/either'
import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { type QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface DeleteQuestionCommentUseCaseRequest {
    authorId: string
    commentId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<
    NotFoundError | UnauthorizedError,
    null
>

export class DeleteQuestionCommentUseCase {
    constructor(
        private readonly questionCommentsRepository: QuestionCommentsRepository,
    ) {}

    async execute({
        commentId,
        authorId,
    }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
        const comment = await this.questionCommentsRepository.getById(commentId)

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

        await this.questionCommentsRepository.delete(commentId)

        return right(null)
    }
}
