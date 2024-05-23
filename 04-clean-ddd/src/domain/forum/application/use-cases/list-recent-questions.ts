import { type Either, right } from '@/core/either'
import { type Question } from '../../enterprise/entities/question'
import { type QuestionsRepository } from '../repositories/questions-repository'

interface ListRecentQuestionsUseCaseRequest {
    page: number
}

type ListRecentQuestionsUseCaseResponse = Either<
    null,
    {
        questions: Question[]
    }
>

export class ListRecentQuestionsUseCase {
    constructor(private readonly questionsRepository: QuestionsRepository) {}

    async execute(
        params: ListRecentQuestionsUseCaseRequest,
    ): Promise<ListRecentQuestionsUseCaseResponse> {
        const { page } = params

        const questions = await this.questionsRepository.getManyRecent({ page })

        return right({ questions })
    }
}
