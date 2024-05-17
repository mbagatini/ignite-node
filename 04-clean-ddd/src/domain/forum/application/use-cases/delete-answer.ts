import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { type AnswersRepository } from '../repositories/answers-repository'

interface DeleteAnswerUseCaseRequest {
    authorId: string
    answerId: string
}

export class DeleteAnswerUseCase {
    constructor(private readonly answersRepository: AnswersRepository) {}

    async execute({
        answerId,
        authorId,
    }: DeleteAnswerUseCaseRequest): Promise<void> {
        const answer = await this.answersRepository.getById(answerId)

        if (!answer) {
            throw new NotFoundError('Answer not found')
        }

        if (answer.authorId.toString() !== authorId) {
            throw new UnauthorizedError(
                'You are not allowed to delete this answer',
            )
        }

        await this.answersRepository.delete(answerId)
    }
}
