import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { type Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
    public questions: Question[] = []

    async create(question: Question): Promise<void> {
        this.questions.push(question)
    }

    async update(question: Question): Promise<void> {
        const index = this.questions.findIndex(
            (item) => item.id.toString() === question.id.toString(),
        )

        this.questions[index] = question
    }

    async delete(id: string): Promise<void> {
        const index = this.questions.findIndex(
            (question) => question.id.toString() === id,
        )

        this.questions.splice(index, 1)
    }

    async getById(id: string): Promise<Question | null> {
        const question = this.questions.find(
            (question) => question.id.toString() === id,
        )

        return question ?? null
    }

    async getBySlug(slug: string): Promise<Question | null> {
        const question = this.questions.find(
            (question) => question.slug.value === slug,
        )

        return question ?? null
    }

    async getManyRecent(params: PaginationParams): Promise<Question[]> {
        const { page } = params
        const indexStart = (page - 1) * 20
        const indexEnd = page * 20

        const questions = this.questions.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        )

        return questions.slice(indexStart, indexEnd)
    }

    async getAll(): Promise<Question[]> {
        return this.questions
    }
}
