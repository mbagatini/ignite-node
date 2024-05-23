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
            (comment) => comment.id.toString() !== id,
        )

        this.comments.splice(index, 1)
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
}
