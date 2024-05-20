import { NotFoundError } from '@/core/errors/not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { type Answer } from '../../enterprise/entities/answer'
import { type Question } from '../../enterprise/entities/question'
import { type AnswersRepository } from '../repositories/answers-repository'
import { type QuestionsRepository } from '../repositories/questions-repository'

interface ChooseQuestionBestAnswerUseCaseRequest {
    answerId: string
    authorId: string
}

interface ChooseQuestionBestAnswerUseCaseResponse {
    question: Question
    answer: Answer
}

export class ChooseQuestionBestAnswerUseCase {
    constructor(
        private readonly answersRepository: AnswersRepository,
        private readonly questionsRepository: QuestionsRepository,
    ) {}

    async execute({
        answerId,
        authorId,
    }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
        const answer = await this.answersRepository.getById(answerId)

        if (!answer) {
            throw new NotFoundError('Answer not found')
        }

        const question = await this.questionsRepository.getById(
            answer.questionId.toString(),
        )

        if (!question) {
            throw new NotFoundError('Question not found')
        }

        if (question.authorId.toString() !== authorId) {
            throw new UnauthorizedError(
                'You are not allowed to delete this answer',
            )
        }

        question.bestAnswerId = answer.id

        await this.questionsRepository.update(question)

        return { answer, question }
    }
}
