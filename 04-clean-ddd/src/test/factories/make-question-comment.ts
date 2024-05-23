import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
    type QuestionCommentProps,
    QuestionComment,
} from '@/domain/forum/enterprise/entities/question-comment'
import { faker } from '@faker-js/faker'

export function makeQuestionComment(
    override: Partial<QuestionCommentProps> = {},
    id?: UniqueEntityID,
): QuestionComment {
    const comment = QuestionComment.create(
        {
            questionId: new UniqueEntityID(),
            authorId: new UniqueEntityID(),
            content: faker.lorem.text(),
            ...override,
        },
        id,
    )

    return comment
}
