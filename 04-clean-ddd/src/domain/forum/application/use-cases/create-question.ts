import { type Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

interface CreateQuestionUseCaseRequest {
    authorId: string
    title: string
    content: string
    attachmentIds?: string[]
}

type CreateQuestionUseCaseResponse = Either<
    null,
    {
        question: Question
    }
>

export class CreateQuestionUseCase {
    constructor(private readonly questionsRepository: QuestionsRepository) {}

    async execute({
        authorId,
        title,
        content,
        attachmentIds,
    }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
        const question = Question.create({
            title,
            content,
            authorId: new UniqueEntityID(authorId),
        })

        if (attachmentIds) {
            const attachments = attachmentIds.map((attachmentId, index) => {
                return QuestionAttachment.create(
                    {
                        questionId: question.id,
                        link: `attachment-${index}`,
                        title: `attachment-${index}`,
                    },
                    new UniqueEntityID(attachmentId),
                )
            })

            question.attachments = new QuestionAttachmentList(attachments)
        }

        await this.questionsRepository.create(question)

        return right({ question })
    }
}
