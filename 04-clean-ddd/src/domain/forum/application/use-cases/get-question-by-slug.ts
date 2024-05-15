import { NotFoundError } from '@/core/errors/not-found-error'
import { type Question } from '../../enterprise/entities/question'
import { type QuestionsRepository } from '../repositories/questions-repository'

export class GetQuestionBySlugUseCase {
    constructor(private readonly questionsRepository: QuestionsRepository) {}

    async execute(slug: string): Promise<Question> {
        const question = await this.questionsRepository.getBySlug(slug)

        if (!question) {
            throw new NotFoundError('Question not found')
        }

        return question
    }
}
