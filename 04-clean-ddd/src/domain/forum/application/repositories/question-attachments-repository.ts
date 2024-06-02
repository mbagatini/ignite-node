import { type QuestionAttachment } from '../../enterprise/entities/question-attachment'

export interface QuestionAttachmentsRepository {
    deleteByQuestionId: (questionId: string) => Promise<void>
    findManyByQuestionId: (questionId: string) => Promise<QuestionAttachment[]>
}
