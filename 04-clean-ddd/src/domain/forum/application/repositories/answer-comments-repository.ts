import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
    create: (comment: AnswerComment) => Promise<void>
    delete: (id: string) => Promise<void>
    getById: (id: string) => Promise<AnswerComment | null>
    getAll: () => Promise<AnswerComment[]>
    getByAnswerId: (
        answerId: string,
        params: PaginationParams,
    ) => Promise<AnswerComment[]>
}
