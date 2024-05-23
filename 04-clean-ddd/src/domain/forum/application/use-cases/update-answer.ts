import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { type AnswersRepository } from '../repositories/answers-repository'
import { type Answer } from '../../enterprise/entities/answer'
import { left, right, type Either } from '@/core/either'

interface UpdateAnswerUseCaseRequest {
    answerId: string
    authorId: string
    content: string
}

type UpdateAnswerUseCaseResponse = Either<
    NotFoundError | UnauthorizedError,
    {
        answer: Answer
    }
>

export class UpdateAnswerUseCase {
    constructor(private readonly answersRepository: AnswersRepository) {}

    async execute({
        answerId,
        authorId,
        content,
    }: UpdateAnswerUseCaseRequest): Promise<UpdateAnswerUseCaseResponse> {
        const answer = await this.answersRepository.getById(answerId)

        if (!answer) {
            return left(new NotFoundError('Answer not found'))
        }

        if (answer.authorId.toString() !== authorId) {
            return left(
                new UnauthorizedError(
                    'You are not allowed to delete this answer',
                ),
            )
        }

        answer.content = content

        await this.answersRepository.update(answer)

        return right({ answer })
    }
}
