import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Question } from '@/domain/forum/enterprise/entities/question'
import {
    type QuestionCommentProps,
    QuestionComment,
} from '@/domain/forum/enterprise/entities/question-comment'
import { faker } from '@faker-js/faker'
import { makeQuestion } from './make-question'

type MakeQuestionCommentProps = Partial<QuestionCommentProps> & {
    question?: Question
}

export function makeQuestionComment(
    override: MakeQuestionCommentProps = {},
    id?: UniqueEntityID,
): QuestionComment {
    const question = override.question ?? makeQuestion()

    const comment = QuestionComment.create(
        {
            questionId: new UniqueEntityID(),
            authorId: new UniqueEntityID(),
            content: faker.lorem.text(),
            question,
            ...override,
        },
        id,
    )

    return comment
}
