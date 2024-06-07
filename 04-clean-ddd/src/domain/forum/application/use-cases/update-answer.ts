import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { type AnswersRepository } from '../repositories/answers-repository'
import { type Answer } from '../../enterprise/entities/answer'
import { left, right, type Either } from '@/core/either'
import { type AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface UpdateAnswerUseCaseRequest {
    answerId: string
    authorId: string
    content: string
    attachmentIds?: string[]
}

type UpdateAnswerUseCaseResponse = Either<
    NotFoundError | UnauthorizedError,
    {
        answer: Answer
    }
>

export class UpdateAnswerUseCase {
    constructor(
        private readonly answersRepository: AnswersRepository,
        private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
    ) {}

    async execute({
        answerId,
        authorId,
        content,
        attachmentIds,
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

        if (attachmentIds) {
            const currentAttachments =
                await this.answerAttachmentsRepository.findManyByAnswerId(
                    answerId,
                )

            const answerAttachmentList = new AnswerAttachmentList(
                currentAttachments,
            )

            const answerAttachments = attachmentIds.map((attachmentId) => {
                return AnswerAttachment.create(
                    {
                        answerId: answer.id,
                    },
                    new UniqueEntityID(attachmentId),
                )
            })

            answerAttachmentList.update(answerAttachments)

            answer.attachments = answerAttachmentList
        }

        answer.content = content

        await this.answersRepository.update(answer)

        return right({ answer })
    }
}
