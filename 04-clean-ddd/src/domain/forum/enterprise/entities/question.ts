import dayjs from 'dayjs'
import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'
import { Slug } from './value-objects/slug'

export interface QuestionProps {
    title: string
    slug: Slug
    content: string
    authorId: UniqueEntityID
    bestAnswerId?: UniqueEntityID
    createdAt: Date
    updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {
    static create(
        props: Optional<QuestionProps, 'createdAt' | 'slug'>,
        id?: UniqueEntityID,
    ) {
        const question = new Question(
            {
                ...props,
                slug: props.slug ?? Slug.createFromText(props.title),
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )

        return question
    }

    get title() {
        return this.props.title
    }

    get slug() {
        return this.props.slug
    }

    get content() {
        return this.props.content
    }

    get authorId() {
        return this.props.authorId
    }

    get bestAnswerId() {
        return this.props.bestAnswerId
    }

    set bestAnswerId(id: UniqueEntityID | undefined) {
        this.props.bestAnswerId = id
        this.touch()
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    get isNew() {
        return dayjs().diff(this.createdAt, 'days') <= 3
    }

    get excerpt() {
        return this.content.substring(0, 120).trimEnd().concat('...')
    }

    private touch() {
        this.props.updatedAt = new Date()
    }
}
