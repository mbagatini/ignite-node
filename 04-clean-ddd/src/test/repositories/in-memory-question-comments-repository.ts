import { type QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { type QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
    implements QuestionCommentsRepository
{
    private readonly comments: QuestionComment[] = []

    async create(comment: QuestionComment): Promise<void> {
        this.comments.push(comment)
    }
}
