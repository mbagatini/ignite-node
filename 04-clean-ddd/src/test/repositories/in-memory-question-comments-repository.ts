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

    async getById(id: string): Promise<QuestionComment | null> {
        const comment = this.comments.find(
            (comment) => comment.id.toString() === id,
        )

        return comment ?? null
    }

    async getAll(): Promise<QuestionComment[]> {
        return this.comments
    }
}
