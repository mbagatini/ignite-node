import { type AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { type AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
    implements AnswerAttachmentsRepository
{
    public attachments: AnswerAttachment[] = []

    async deleteByAnswerId(answerId: string) {
        this.attachments = this.attachments.filter(
            (item) => item.answerId.toString() !== answerId,
        )
    }

    async findManyByAnswerId(answerId: string) {
        const answerAttachments = this.attachments.filter(
            (item) => item.answerId.toString() === answerId,
        )

        return answerAttachments
    }
}
