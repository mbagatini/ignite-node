import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { type QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
    implements QuestionCommentsRepository
{
    public comments: QuestionComment[] = []

    async create(comment: QuestionComment): Promise<void> {
        this.comments.push(comment)
    }

    async delete(id: string): Promise<void> {
        const index = this.comments.findIndex(
            (comment) => comment.id.toString() !== id,
        )

        this.comments.splice(index, 1)
    }

    async deleteByQuestionId(questionId: string): Promise<void> {
        this.comments = this.comments.filter(
            (comment) => comment.questionId.toString() !== questionId,
        )
    }

    async getById(id: string): Promise<QuestionComment | null> {
        const comment = this.comments.find(
            (comment) => comment.id.toString() === id,
        )

        return comment ?? null
    }

    async getAll(): Promise<QuestionComment[]> {
        return this.comments
    }

    async getByQuestionId(
        questionId: string,
        params: PaginationParams,
    ): Promise<QuestionComment[]> {
        const { page } = params
        const indexStart = (page - 1) * 20
        const indexEnd = page * 20

        const comments = this.comments.filter(
            (comment) => comment.questionId.toString() === questionId,
        )

        return comments.slice(indexStart, indexEnd)
    }
}
