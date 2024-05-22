import { type AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { type AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
    implements AnswerCommentsRepository
{
    private readonly comments: AnswerComment[] = []

    async create(comment: AnswerComment): Promise<void> {
        this.comments.push(comment)
    }
}
