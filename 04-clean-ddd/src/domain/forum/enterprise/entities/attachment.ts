import { Entity } from '@/core/entities/entity'

export interface AttachmentProps {
    title?: string
    link?: string
}

export abstract class Attachment<T extends AttachmentProps> extends Entity<T> {
    get title() {
        return this.props.title
    }

    get link() {
        return this.props.link
    }
}
