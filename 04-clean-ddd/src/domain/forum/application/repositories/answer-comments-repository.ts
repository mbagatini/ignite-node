import { type AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
    create: (comment: AnswerComment) => Promise<void>
}
