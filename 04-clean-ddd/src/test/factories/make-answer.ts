import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import {
    Answer,
    type AnswerProps,
} from '@/domain/forum/enterprise/entities/answer'

export function makeAnswer(
    override: Partial<AnswerProps> = {},
    id?: UniqueEntityID,
): Answer {
    const answer = Answer.create(
        {
            questionId: new UniqueEntityID(),
            authorId: new UniqueEntityID(),
            content: faker.lorem.text(),
            ...override,
        },
        id,
    )

    return answer
}
