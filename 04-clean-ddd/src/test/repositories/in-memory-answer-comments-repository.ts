import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { type AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
    implements AnswerCommentsRepository
{
    public comments: AnswerComment[] = []

    async create(comment: AnswerComment): Promise<void> {
        this.comments.push(comment)
    }

    async delete(id: string): Promise<void> {
        const index = this.comments.findIndex(
            (comment) => comment.id.toString() === id,
        )

        this.comments.splice(index, 1)
    }

    async deleteByAnswerId(answerId: string): Promise<void> {
        this.comments = this.comments.filter(
            (comment) => comment.answerId.toString() !== answerId,
        )
    }

    async getById(id: string): Promise<AnswerComment | null> {
        const comment = this.comments.find(
            (comment) => comment.id.toString() === id,
        )

        return comment ?? null
    }

    async getAll(): Promise<AnswerComment[]> {
        return this.comments
    }

    async getByAnswerId(
        answerId: string,
        params: PaginationParams,
    ): Promise<AnswerComment[]> {
        const { page } = params
        const indexStart = (page - 1) * 20
        const indexEnd = page * 20

        const comments = this.comments.filter(
            (comment) => comment.answerId.toString() === answerId,
        )

        return comments.slice(indexStart, indexEnd)
    }
}
