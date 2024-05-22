import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'
import { Comment, type CommentProps } from './comment'

export interface AnswerCommentProps extends CommentProps {
    answerId: UniqueEntityID
}

export class AnswerComment extends Comment<AnswerCommentProps> {
    static create(
        props: Optional<AnswerCommentProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const answer = new AnswerComment(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )

        return answer
    }

    get answerId() {
        return this.props.answerId
    }
}
