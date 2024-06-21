import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'
import { type Answer } from './answer'
import { Comment, type CommentProps } from './comment'

export interface AnswerCommentProps extends CommentProps {
    answerId: UniqueEntityID
}

type CreateAnswerCommentProps = Optional<AnswerCommentProps, 'createdAt'> & {
    answer: Answer
}

export class AnswerComment extends Comment<AnswerCommentProps> {
    static create(props: CreateAnswerCommentProps, id?: UniqueEntityID) {
        const comment = new AnswerComment(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )

        props.answer.onCommented(comment)

        return comment
    }

    get answerId() {
        return this.props.answerId
    }
}
