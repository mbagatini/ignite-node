import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
    Question,
    type QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export function makeQuestion(override: Partial<QuestionProps>): Question {
    const question = Question.create({
        authorId: new UniqueEntityID(),
        slug: Slug.create('example-question'),
        title: 'Nova pergunta',
        content: 'Conteúdo da pergunta',
        ...override,
    })

    return question
}
