import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Attachment, type AttachmentProps } from './attachment'

export interface AnswerAttachmentProps extends AttachmentProps {
    answerId: UniqueEntityID
}

export class AnswerAttachment extends Attachment<AnswerAttachmentProps> {
    static create(props: AnswerAttachmentProps, id?: UniqueEntityID) {
        return new AnswerAttachment(props, id)
    }

    get answerId() {
        return this.props.answerId
    }
}
