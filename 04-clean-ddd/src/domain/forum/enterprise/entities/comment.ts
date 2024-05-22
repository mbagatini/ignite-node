import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CommentProps {
    content: string
    authorId: UniqueEntityID
    createdAt: Date
    updatedAt?: Date
}

export abstract class Comment<T extends CommentProps> extends Entity<T> {
    get content() {
        return this.props.content
    }

    set content(value: string) {
        this.props.content = value
        this.touch()
    }

    get authorId() {
        return this.props.authorId
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    get excerpt() {
        return this.content.substring(0, 120).trimEnd().concat('...')
    }

    private touch() {
        this.props.updatedAt = new Date()
    }
}
