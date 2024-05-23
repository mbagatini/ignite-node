import { type QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentsRepository {
    create: (comment: QuestionComment) => Promise<void>
    delete: (id: string) => Promise<void>
    getById: (id: string) => Promise<QuestionComment | null>
    getAll: () => Promise<QuestionComment[]>
}
