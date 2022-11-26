import { UserRepository } from '@domain/user.repository'
import { ApiKeyFunctions } from '@utils'

export type ValidateUsersFactory = ReturnType<typeof validateUsersFactory>

export type GetUsersInput = {
  readonly userIds: readonly string[]
  readonly masterApiKey: string
}

export const validateUsersFactory =
  (userRepository: UserRepository, apiKeyFunctions: ApiKeyFunctions) =>
  ({ masterApiKey, userIds }: GetUsersInput) =>
    apiKeyFunctions.checkMasterApiKey(masterApiKey).asyncAndThen(() => userRepository.validateUsers(userIds))
