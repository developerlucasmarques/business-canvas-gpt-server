import type { QuestionModel } from '@/domain/models/db-models'
import { right, type Either, left } from '@/shared/either'
import { AnswerAndAlternativeNotProvidedError, InvalidQuestionIdError, InvalidAnswerError, AnswerIsNotAllowedError, MixedAnswerError, AlternativeIsNotAllowedError, InvalidAlternativeIdError } from './errors'

export interface AnswerEntityModel {
  questionId: string
  alternativeId?: string
  answer?: string
}

export interface UserAnswer {
  questionId: string
  alternativeId?: string
  answer?: string
}

export interface AnswerDto {
  userAnswer: UserAnswer
  questions: QuestionModel[]
}

export type AnswerErrors =
InvalidQuestionIdError |
AnswerAndAlternativeNotProvidedError |
InvalidAnswerError |
AnswerIsNotAllowedError |
MixedAnswerError |
AlternativeIsNotAllowedError |
InvalidAlternativeIdError

export type AnswerRes = Either<AnswerErrors, Answer>
type ValidateRes = Either<AnswerErrors, null>

export class Answer {
  private constructor (private readonly answer: AnswerEntityModel) {}

  static create (dto: AnswerDto): AnswerRes {
    const validateResult = this.validate(dto)
    if (validateResult.isLeft()) {
      return left(validateResult.value)
    }
    const answer: AnswerEntityModel = {
      questionId: dto.userAnswer.questionId,
      ...(dto.userAnswer.alternativeId && { alternativeId: dto.userAnswer.alternativeId })
    }
    return right(new Answer(answer))
  }

  private static validate (dto: AnswerDto): ValidateRes {
    const { userAnswer: { questionId, alternativeId, answer }, questions } = dto
    if (!alternativeId && !answer) {
      return left(new AnswerAndAlternativeNotProvidedError())
    }
    if (answer && alternativeId) {
      return left(new MixedAnswerError())
    }
    const question = questions.find(question => question.id === questionId)
    if (!question) {
      return left(new InvalidQuestionIdError(questionId))
    }
    if (question?.alternatives && answer) {
      return left(new AnswerIsNotAllowedError())
    }
    if (!question?.alternatives && alternativeId) {
      return left(new AlternativeIsNotAllowedError())
    }
    if (question.alternatives && alternativeId) {
      const alternative = question.alternatives.find(
        alternative => alternative.id === alternativeId
      )
      if (!alternative) {
        return left(new InvalidAlternativeIdError(alternativeId))
      }
    }
    if (!question.alternatives && answer) {
      if (answer.length < 3 || answer.length > 750) {
        return left(new InvalidAnswerError(answer))
      }
    }
    return right(null)
  }
}
