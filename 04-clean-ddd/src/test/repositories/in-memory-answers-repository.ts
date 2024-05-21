import { type PaginationParams } from '@/core/repositories/pagination-params'
import { type AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { type Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
    public answers: Answer[] = []

    async create(answer: Answer): Promise<void> {
        this.answers.push(answer)
    }

    async update(answer: Answer): Promise<void> {
        const index = this.answers.findIndex(
            (item) => item.id.toString() === answer.id.toString(),
        )

        this.answers[index] = answer
    }

    async delete(id: string): Promise<void> {
        const index = this.answers.findIndex(
            (answer) => answer.id.toString() !== id,
        )

        this.answers.splice(index, 1)
    }

    async getById(id: string): Promise<Answer | null> {
        const answer = this.answers.find(
            (answer) => answer.id.toString() === id,
        )

        return answer ?? null
    }

    async getAll(): Promise<Answer[]> {
        return this.answers
    }

    async getByQuestionId(
        questionId: string,
        params: PaginationParams,
    ): Promise<Answer[]> {
        const { page } = params
        const indexStart = (page - 1) * 20
        const indexEnd = page * 20

        const answers = this.answers.filter(
            (answer) => answer.questionId.toString() === questionId,
        )

        return answers.slice(indexStart, indexEnd)
    }
}
