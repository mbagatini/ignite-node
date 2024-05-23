import { NotFoundError } from '@/core/errors/not-found-error'
import { type AnswerComment } from '../../enterprise/entities/answer-comment'
import { type AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { type AnswersRepository } from '../repositories/answers-repository'
import { left, right, type Either } from '@/core/either'

interface ListAnswerCommentsUseCaseRequest {
    answerId: string
    page: number
}

type ListAnswerCommentsUseCaseResponse = Either<
    NotFoundError,
    {
        comments: AnswerComment[]
    }
>

export class ListAnswerCommentsUseCase {
    constructor(
        private readonly answersRepository: AnswersRepository,
        private readonly answerCommentsRepository: AnswerCommentsRepository,
    ) {}

    async execute(
        params: ListAnswerCommentsUseCaseRequest,
    ): Promise<ListAnswerCommentsUseCaseResponse> {
        const { answerId, page } = params

        const answer = await this.answersRepository.getById(answerId)

        if (!answer) {
            return left(new NotFoundError('Answer not found'))
        }

        const comments = await this.answerCommentsRepository.getByAnswerId(
            answerId,
            { page },
        )

        return right({ comments })
    }
}
