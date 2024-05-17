import { type QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { type Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
    public questions: Question[] = []

    async create(question: Question): Promise<void> {
        this.questions.push(question)
    }

    async delete(id: string): Promise<void> {
        const index = this.questions.findIndex(
            (question) => question.id.toString() !== id,
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

    async getAll(): Promise<Question[]> {
        return this.questions
    }
}
