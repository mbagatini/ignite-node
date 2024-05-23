import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { type QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface DeleteQuestionCommentUseCaseRequest {
    authorId: string
    commentId: string
}

export class DeleteQuestionCommentUseCase {
    constructor(
        private readonly questionCommentsRepository: QuestionCommentsRepository,
    ) {}

    async execute({
        commentId,
        authorId,
    }: DeleteQuestionCommentUseCaseRequest): Promise<void> {
        const comment = await this.questionCommentsRepository.getById(commentId)

        if (!comment) {
            throw new NotFoundError('Comment not found')
        }

        if (comment.authorId.toString() !== authorId) {
            throw new UnauthorizedError(
                'You are not allowed to delete this comment',
            )
        }

        await this.questionCommentsRepository.delete(commentId)
    }
}
