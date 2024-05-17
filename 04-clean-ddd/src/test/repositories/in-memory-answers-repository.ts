import { type AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { type Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
    public answers: Answer[] = []

    async create(answer: Answer): Promise<void> {
        this.answers.push(answer)
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
}
