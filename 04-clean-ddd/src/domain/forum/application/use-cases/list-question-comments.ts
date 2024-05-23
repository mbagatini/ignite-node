import { NotFoundError } from '@/core/errors/not-found-error'
import { type QuestionComment } from '../../enterprise/entities/question-comment'
import { type QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { left, right, type Either } from '@/core/either'

interface ListQuestionCommentsUseCaseRequest {
    questionId: string
    page: number
}

type ListQuestionCommentsUseCaseResponse = Either<
    NotFoundError,
    {
        comments: QuestionComment[]
    }
>

export class ListQuestionCommentsUseCase {
    constructor(
        private readonly questionsRepository: QuestionsRepository,
        private readonly questionCommentsRepository: QuestionCommentsRepository,
    ) {}

    async execute(
        params: ListQuestionCommentsUseCaseRequest,
    ): Promise<ListQuestionCommentsUseCaseResponse> {
        const { questionId, page } = params

        const question = await this.questionsRepository.getById(questionId)

        if (!question) {
            return left(new NotFoundError('Question not found'))
        }

        const comments = await this.questionCommentsRepository.getByQuestionId(
            questionId,
            { page },
        )

        return right({ comments })
    }
}
