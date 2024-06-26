import { AggregateRoot } from '@/core/entities/aggregate-root'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen'
import { QuestionAttachmentList } from './question-attachment-list'
import { Slug } from './value-objects/slug'
import { type QuestionComment } from './question-comment'
import { QuestionCommentedEvent } from '../events/question-commented-event'

export interface QuestionProps {
    title: string
    slug: Slug
    content: string
    authorId: UniqueEntityID
    bestAnswerId?: UniqueEntityID
    attachments?: QuestionAttachmentList
    createdAt: Date
    updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
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

    set title(title: string) {
        this.props.title = title
        this.slug = Slug.createFromText(title)
        this.touch()
    }

    get slug() {
        return this.props.slug
    }

    set slug(slug: Slug) {
        this.props.slug = slug
        this.touch()
    }

    get content() {
        return this.props.content
    }

    set content(content: string) {
        this.props.content = content
        this.touch()
    }

    get authorId() {
        return this.props.authorId
    }

    get bestAnswerId() {
        return this.props.bestAnswerId
    }

    set bestAnswerId(id: UniqueEntityID | undefined) {
        if (!id) {
            this.props.bestAnswerId = id
            this.touch()
            return
        }

        if (!this.props.bestAnswerId || !id.equals(this.props.bestAnswerId)) {
            this.props.bestAnswerId = id
            this.touch()

            this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, id))
        }
    }

    get attachments() {
        return this.props.attachments ?? new QuestionAttachmentList()
    }

    set attachments(attachments: QuestionAttachmentList) {
        this.props.attachments = attachments
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

    public onCommented(comment: QuestionComment) {
        this.addDomainEvent(new QuestionCommentedEvent(this, comment))
    }
}
