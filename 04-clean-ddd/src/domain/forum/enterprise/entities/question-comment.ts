import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'
import { Comment, type CommentProps } from './comment'

export interface QuestionCommentProps extends CommentProps {
    questionId: UniqueEntityID
}

export class QuestionComment extends Comment<QuestionCommentProps> {
    static create(
        props: Optional<QuestionCommentProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const answer = new QuestionComment(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )

        return answer
    }

    get questionId() {
        return this.props.questionId
    }
}
