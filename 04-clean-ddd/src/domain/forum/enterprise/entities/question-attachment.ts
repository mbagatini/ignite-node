import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Attachment, type AttachmentProps } from './attachment'

export interface QuestionAttachmentProps extends AttachmentProps {
    questionId: UniqueEntityID
}

export class QuestionAttachment extends Attachment<QuestionAttachmentProps> {
    static create(props: QuestionAttachmentProps, id?: UniqueEntityID) {
        return new QuestionAttachment(props, id)
    }

    get questionId() {
        return this.props.questionId
    }
}
