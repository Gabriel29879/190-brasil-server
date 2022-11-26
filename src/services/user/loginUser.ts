import { UserDocument } from '@domain/user.model'
import { UserRepository } from '@domain/user.repository'
import { exceptionHandler, BcryptFunctions, baseExceptionHandler } from '@utils'
import { FastifyInstance } from 'fastify'
import { err, fromThrowable, ok } from 'neverthrow'

const THREE_DAYS_IN_SECONDS = 3 * 24 * 60 * 60

export type LoginUserFactory = ReturnType<typeof loginUserFactory>

export type UserCredentials = {
  readonly cpf: string
  readonly password: string
}

type TokenAndUserObj = {
  readonly user: UserDocument
  readonly token: string
}

export const loginUserFactory =
  (userRepository: UserRepository, bcryptFunctions: BcryptFunctions) =>
  (userCredentials: UserCredentials, fastify: FastifyInstance) => {
    const validateIfUserExists = (user: UserDocument | null) => {
      if (!user) return err(exceptionHandler('Credentials dont match any user', 404))
      return ok(user)
    }

    const validatePasswordMatch = (user: UserDocument) =>
      bcryptFunctions.compare(userCredentials.password, user.password).map(() => user)

    const signJwt = fromThrowable(
      (_id: string) => fastify.jwt.sign({ _id }, { expiresIn: THREE_DAYS_IN_SECONDS }),
      baseExceptionHandler,
    )

    const createToken = (user: UserDocument) => signJwt(user._id.toString()).map((token) => ({ token, user }))

    const filterReturnedUserInformation = ({ token, user }: TokenAndUserObj) => ({
      token,
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      isValidated: user.isValidated,
    })

    return userRepository
      .findByCpf(userCredentials.cpf)
      .andThen(validateIfUserExists)
      .andThen(validatePasswordMatch)
      .andThen(createToken)
      .map(filterReturnedUserInformation)
  }
