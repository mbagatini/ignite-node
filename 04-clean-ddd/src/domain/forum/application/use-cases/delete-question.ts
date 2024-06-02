import { left, right, type Either } from '@/core/either'
import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { type QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { type QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { type QuestionsRepository } from '../repositories/questions-repository'
import { type AnswersRepository } from '../repositories/answers-repository'
import { type DeleteAnswerUseCase } from './delete-answer'

interface DeleteQuestionUseCaseRequest {
    authorId: string
    questionId: string
}

type DeleteQuestionUseCaseResponse = Either<
    NotFoundError | UnauthorizedError,
    null
>

export class DeleteQuestionUseCase {
    constructor(
        private readonly questionsRepository: QuestionsRepository,
        private readonly questionCommentsRepository: QuestionCommentsRepository,
        private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
        private readonly answersRepository: AnswersRepository,
        private readonly deleteAnswerUseCase: DeleteAnswerUseCase,
    ) {}

    async execute({
        questionId,
        authorId,
    }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
        const question = await this.questionsRepository.getById(questionId)

        if (!question) {
            return left(new NotFoundError('Question not found'))
        }

        if (question.authorId.toString() !== authorId) {
            return left(
                new UnauthorizedError(
                    'You are not allowed to delete this question',
                ),
            )
        }

        await this.questionsRepository.delete(questionId)
        await this.questionCommentsRepository.deleteByQuestionId(questionId)
        await this.questionAttachmentsRepository.deleteByQuestionId(questionId)

        // Delete all answers from this question
        let page = 1
        do {
            const answers = await this.answersRepository.getByQuestionId(
                questionId,
                { page },
            )

            for (const answer of answers) {
                await this.deleteAnswerUseCase.execute({
                    answerId: answer.id.toString(),
                    authorId: answer.authorId.toString(),
                })
            }

            if (answers.length === 0) {
                page = 0
            } else {
                page++
            }
        } while (page > 0)

        return right(null)
    }
}
