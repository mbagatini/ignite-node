import { type Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
    create: (answer: Answer) => Promise<void>
    update: (answer: Answer) => Promise<void>
    delete: (id: string) => Promise<void>
    getById: (id: string) => Promise<Answer | null>
    getAll: () => Promise<Answer[]>
}
