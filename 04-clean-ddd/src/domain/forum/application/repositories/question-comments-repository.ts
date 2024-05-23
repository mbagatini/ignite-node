import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentsRepository {
    create: (comment: QuestionComment) => Promise<void>
    delete: (id: string) => Promise<void>
    getById: (id: string) => Promise<QuestionComment | null>
    getByQuestionId: (
        questionId: string,
        params: PaginationParams,
    ) => Promise<QuestionComment[]>
    getAll: () => Promise<QuestionComment[]>
}
