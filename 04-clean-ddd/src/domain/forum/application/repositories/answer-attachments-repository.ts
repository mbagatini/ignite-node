import { type AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export interface AnswerAttachmentsRepository {
    deleteByAnswerId: (answerId: string) => Promise<void>
    findManyByAnswerId: (answerId: string) => Promise<AnswerAttachment[]>
}
