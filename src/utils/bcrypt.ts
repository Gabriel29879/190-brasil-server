import bcrypt from 'bcrypt'
import { fromPromise } from 'neverthrow'
import { baseExceptionHandler } from './exceptionHandler'

export type BcryptFunctions = ReturnType<typeof bcryptFunctions>

export const bcryptFunctions = () => ({
  genSalt: () => fromPromise(bcrypt.genSalt(), baseExceptionHandler),
  hash: (password: string, salt: string) => fromPromise(bcrypt.hash(password, salt), baseExceptionHandler),
  compare: (password: string, userPassword: string) =>
    fromPromise(bcrypt.compare(password, userPassword), baseExceptionHandler),
})
