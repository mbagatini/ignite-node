import { left, right, type Either } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors/not-found-error'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { type QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { type QuestionsRepository } from '../repositories/questions-repository'

interface CommentQuestionUseCaseRequest {
    authorId: string
    questionId: string
    content: string
}

type CommentQuestionUseCaseResponse = Either<
    NotFoundError,
    {
        comment: QuestionComment
    }
>

export class CommentQuestionUseCase {
    constructor(
        private readonly questionCommentsRepository: QuestionCommentsRepository,
        private readonly questionsRepository: QuestionsRepository,
    ) {}

    async execute({
        authorId,
        questionId,
        content,
    }: CommentQuestionUseCaseRequest): Promise<CommentQuestionUseCaseResponse> {
        const question = await this.questionsRepository.getById(questionId)

        if (!question) {
            return left(new NotFoundError('Question not found'))
        }

        const comment = QuestionComment.create({
            content,
            authorId: new UniqueEntityID(authorId),
            questionId: new UniqueEntityID(questionId),
        })

        await this.questionCommentsRepository.create(comment)

        return right({ comment })
    }
}
