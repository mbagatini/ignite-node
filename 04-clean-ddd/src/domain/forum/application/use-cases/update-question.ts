import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { type Question } from '../../enterprise/entities/question'
import { type Either, left, right } from '@/core/either'
import { type QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface UpdateQuestionUseCaseRequest {
    questionId: string
    authorId: string
    title: string
    content: string
    attachmentIds?: string[]
}

type UpdateQuestionUseCaseResponse = Either<
    NotFoundError | UnauthorizedError,
    {
        question: Question
    }
>

export class UpdateQuestionUseCase {
    constructor(
        private readonly questionsRepository: QuestionsRepository,
        private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
    ) {}

    async execute({
        questionId,
        authorId,
        title,
        content,
        attachmentIds,
    }: UpdateQuestionUseCaseRequest): Promise<UpdateQuestionUseCaseResponse> {
        const question = await this.questionsRepository.getById(questionId)

        if (!question) {
            return left(new NotFoundError('Question not found'))
        }

        if (question.authorId.toString() !== authorId) {
            return left(
                new UnauthorizedError(
                    'You are not allowed to delete this question',
                ),
            )
        }

        if (attachmentIds) {
            const currentQuestionAttachments =
                await this.questionAttachmentsRepository.findManyByQuestionId(
                    questionId,
                )

            const questionAttachmentList = new QuestionAttachmentList(
                currentQuestionAttachments,
            )

            const questionAttachments = attachmentIds.map((attachmentId) => {
                return QuestionAttachment.create(
                    {
                        questionId: question.id,
                    },
                    new UniqueEntityID(attachmentId),
                )
            })

            questionAttachmentList.update(questionAttachments)

            question.attachments = questionAttachmentList
        }

        question.title = title
        question.content = content

        await this.questionsRepository.update(question)

        return right({ question })
    }
}
