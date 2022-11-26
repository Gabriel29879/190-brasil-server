import { UserRepository } from '@domain/user.repository'
import { ApiKeyFunctions, exceptionHandler } from '@utils'
import { err, ok } from 'neverthrow'

export type BlockUserFactory = ReturnType<typeof blockUserFactory>

export type BlockUserInput = {
  readonly _id: string
  readonly masterApiKey: string
}

export const blockUserFactory =
  (userRepository: UserRepository, apiKeyFunctions: ApiKeyFunctions) =>
  ({ masterApiKey, _id }: BlockUserInput) =>
    apiKeyFunctions
      .checkMasterApiKey(masterApiKey)
      .asyncAndThen(() => userRepository.blockUser(_id))
      .andThen(({ modifiedCount }) => {
        if (!modifiedCount) return err(exceptionHandler('No user found', 404))
        return ok('User blocked successfully')
      })
