import { OcurrenceStatusEnum } from '@domain/ocurrence.model'
import { OcurrenceRepository } from '@domain/ocurrence.repository'
import { ApiKeyFunctions } from '@utils'

export type GetCallCenterOcurrencesFactory = ReturnType<typeof getCallCenterOcurrencesFactory>

export type GetCallCenterOcurrencesInput = {
  readonly _id: string
  readonly userId: string
  readonly status: OcurrenceStatusEnum
  readonly callCenterApiKey: string
  readonly skip: number
}

export const getCallCenterOcurrencesFactory =
  (ocurrenceRepository: OcurrenceRepository, apiKeyFunctions: ApiKeyFunctions) =>
  ({ callCenterApiKey, ...filter }: GetCallCenterOcurrencesInput) =>
    apiKeyFunctions
      .checkCallCenterApiKey(callCenterApiKey)
      .andThen(({ callCenter }) => ocurrenceRepository.get({ ...filter, state: callCenter.state }))
