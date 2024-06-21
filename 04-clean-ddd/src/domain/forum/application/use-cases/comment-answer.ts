import { left, right, type Either } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors/not-found-error'
import { DomainEvents } from '@/core/events/domain-events'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { type AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { type AnswersRepository } from '../repositories/answers-repository'

interface CommentAnswerUseCaseRequest {
    authorId: string
    answerId: string
    content: string
}

type CommentAnswerUseCaseResponse = Either<
    NotFoundError,
    { comment: AnswerComment }
>

export class CommentAnswerUseCase {
    constructor(
        private readonly answerCommentsRepository: AnswerCommentsRepository,
        private readonly answersRepository: AnswersRepository,
    ) {}

    async execute({
        authorId,
        answerId,
        content,
    }: CommentAnswerUseCaseRequest): Promise<CommentAnswerUseCaseResponse> {
        const answer = await this.answersRepository.getById(answerId)

        if (!answer) {
            return left(new NotFoundError('Answer not found'))
        }

        const comment = AnswerComment.create({
            content,
            authorId: new UniqueEntityID(authorId),
            answerId: new UniqueEntityID(answerId),
            answer,
        })

        await this.answerCommentsRepository.create(comment)

        // trigger notification
        DomainEvents.dispatchEventsForAggregate(answer.id)

        return right({ comment })
    }
}
