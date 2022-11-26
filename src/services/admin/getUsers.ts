import { UserRepository } from '@domain/user.repository'
import { ApiKeyFunctions } from '@utils'

export type GetUsersFactory = ReturnType<typeof getUsersFactory>

export type GetUsersInput = {
  readonly _id: string
  readonly skip: number
  readonly masterApiKey: string
}

export const getUsersFactory =
  (userRepository: UserRepository, apiKeyFunctions: ApiKeyFunctions) =>
  ({ masterApiKey, ...filter }: GetUsersInput) =>
    apiKeyFunctions
      .checkMasterApiKey(masterApiKey)
      .asyncAndThen(() => userRepository.get(filter))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map((users) => users.map(({ password, ...user }) => user))
