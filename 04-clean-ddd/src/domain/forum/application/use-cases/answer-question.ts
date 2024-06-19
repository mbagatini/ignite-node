import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../../enterprise/entities/answer'
import { right, type Either } from '@/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { DomainEvents } from '@/core/events/domain-events'

interface AnswerQuestionUseCaseRequest {
    instructorId: string
    questionId: string
    content: string
    attachmentIds?: string[]
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>

export class AnswerQuestionUseCase {
    constructor(private readonly answersRepository: AnswersRepository) {}

    async execute({
        instructorId,
        questionId,
        content,
        attachmentIds,
    }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
        const answer = Answer.create({
            content,
            authorId: new UniqueEntityID(instructorId),
            questionId: new UniqueEntityID(questionId),
        })

        if (attachmentIds) {
            const attachments = attachmentIds.map((attachmentId, index) => {
                return AnswerAttachment.create(
                    {
                        answerId: answer.id,
                        link: `attachment-${index}`,
                        title: `attachment-${index}`,
                    },
                    new UniqueEntityID(attachmentId),
                )
            })

            answer.attachments = new AnswerAttachmentList(attachments)
        }

        await this.answersRepository.create(answer)

        // trigger notification
        DomainEvents.dispatchEventsForAggregate(answer.id)

        return right({ answer })
    }
}
