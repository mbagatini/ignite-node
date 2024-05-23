import { left, right, type Either } from '@/core/either'
import { NotFoundError } from '@/core/errors/not-found-error'
import { type Question } from '../../enterprise/entities/question'
import { type QuestionsRepository } from '../repositories/questions-repository'

type GetQuestionBySlugUseCaseResponse = Either<NotFoundError, Question>

export class GetQuestionBySlugUseCase {
    constructor(private readonly questionsRepository: QuestionsRepository) {}

    async execute(slug: string): Promise<GetQuestionBySlugUseCaseResponse> {
        const question = await this.questionsRepository.getBySlug(slug)

        if (!question) {
            return left(new NotFoundError('Question not found'))
        }

        return right(question)
    }
}
