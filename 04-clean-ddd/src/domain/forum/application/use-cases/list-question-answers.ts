import { NotFoundError } from '@/core/errors/not-found-error'
import { type Answer } from '../../enterprise/entities/answer'
import { type AnswersRepository } from '../repositories/answers-repository'
import { type QuestionsRepository } from '../repositories/questions-repository'

interface ListQuestionAnswersUseCaseRequest {
    questionId: string
    page: number
}

interface ListQuestionAnswersUseCaseResponse {
    answers: Answer[]
}

export class ListQuestionAnswersUseCase {
    constructor(
        private readonly questionsRepository: QuestionsRepository,
        private readonly answersRepository: AnswersRepository,
    ) {}

    async execute(
        params: ListQuestionAnswersUseCaseRequest,
    ): Promise<ListQuestionAnswersUseCaseResponse> {
        const { questionId, page } = params

        const question = await this.questionsRepository.getById(questionId)

        if (!question) {
            throw new NotFoundError('Question not found')
        }

        const answers = await this.answersRepository.getByQuestionId(
            questionId,
            { page },
        )

        return { answers }
    }
}
