import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type Question } from '../../enterprise/entities/question'

export interface QuestionsRepository {
    create: (question: Question) => Promise<void>
    update: (question: Question) => Promise<void>
    delete: (id: string) => Promise<void>
    getById: (id: string) => Promise<Question | null>
    getBySlug: (slug: string) => Promise<Question | null>
    getManyRecent: (params: PaginationParams) => Promise<Question[]>
    getAll: () => Promise<Question[]>
}
