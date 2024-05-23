import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { type AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseRequest {
    authorId: string
    commentId: string
}

export class DeleteAnswerCommentUseCase {
    constructor(
        private readonly answerCommentsRepository: AnswerCommentsRepository,
    ) {}

    async execute({
        commentId,
        authorId,
    }: DeleteAnswerCommentUseCaseRequest): Promise<void> {
        const comment = await this.answerCommentsRepository.getById(commentId)

        if (!comment) {
            throw new NotFoundError('Comment not found')
        }

        if (comment.authorId.toString() !== authorId) {
            throw new UnauthorizedError(
                'You are not allowed to delete this comment',
            )
        }

        await this.answerCommentsRepository.delete(commentId)
    }
}
