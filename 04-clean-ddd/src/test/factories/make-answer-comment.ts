import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Answer } from '@/domain/forum/enterprise/entities/answer'
import {
    AnswerComment,
    type AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'
import { faker } from '@faker-js/faker'
import { makeAnswer } from './make-answer'

type MakeAnswerCommentProps = Partial<AnswerCommentProps> & {
    answer?: Answer
}

export function makeAnswerComment(
    override: MakeAnswerCommentProps = {},
    id?: UniqueEntityID,
): AnswerComment {
    const answer = override.answer ?? makeAnswer()

    const comment = AnswerComment.create(
        {
            answerId: answer.id,
            authorId: new UniqueEntityID(),
            content: faker.lorem.text(),
            answer,
            ...override,
        },
        id,
    )

    return comment
}
