import { CallCenterRepository } from '@domain/callCenter.repository'
import { ApiKeyFunctions } from '@utils'

export type GetCallCentersFactory = ReturnType<typeof getCallCentersFactory>

export type GetCallCentersInput = {
  readonly _id: string
  readonly masterApiKey: string
  readonly skip: number
}

export const getCallCentersFactory =
  (callCenterRepository: CallCenterRepository, apiKeyFunctions: ApiKeyFunctions) =>
  ({ masterApiKey, ...filter }: GetCallCentersInput) =>
    apiKeyFunctions
      .checkMasterApiKey(masterApiKey)
      .asyncAndThen(() => callCenterRepository.get(filter))
      .map((callCenters) =>
        callCenters.map(({ name, city, state, createdAt, updatedAt, _id }) => ({
          name,
          city,
          state,
          createdAt,
          updatedAt,
          _id,
        })),
      )
