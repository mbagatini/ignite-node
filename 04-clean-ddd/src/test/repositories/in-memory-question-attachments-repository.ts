import { type QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { type QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
    implements QuestionAttachmentsRepository
{
    public attachments: QuestionAttachment[] = []

    async findManyByQuestionId(questionId: string) {
        const questionAttachments = this.attachments.filter(
            (item) => item.questionId.toString() === questionId,
        )

        return questionAttachments
    }
}
