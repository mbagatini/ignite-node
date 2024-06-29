import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'
import { Comment, type CommentProps } from './comment'
import { type Question } from './question'

export interface QuestionCommentProps extends CommentProps {
    questionId: UniqueEntityID
}

type CreateQuestionCommentProps = Optional<
    QuestionCommentProps,
    'createdAt'
> & {
    question: Question
}

export class QuestionComment extends Comment<QuestionCommentProps> {
    static create(
        props: Optional<CreateQuestionCommentProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const comment = new QuestionComment(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )

        props.question.onCommented(comment)

        return comment
    }

    get questionId() {
        return this.props.questionId
    }
}
