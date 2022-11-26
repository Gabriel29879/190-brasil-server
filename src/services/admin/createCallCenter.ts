import { v4 as uuidv4 } from 'uuid'
import { CallCenterRepository } from '@domain/callCenter.repository'
import { BcryptFunctions } from '@utils'
import { ApiKeyFunctions } from '@utils'
import { CallCenterDocument } from '@domain/callCenter.model'

export type CreateCallCenterFactory = ReturnType<typeof createCallCenterFactory>

export type CreateCallCenterInput = {
  readonly name: string
  readonly city: string
  readonly state: string
  readonly masterApiKey: string
}

type InsertApiKeyInput = {
  readonly hashedKey: string
  readonly apiKey: string
}

export const createCallCenterFactory =
  (callCenterRepository: CallCenterRepository, bcryptFunctions: BcryptFunctions, apiKeyFunctions: ApiKeyFunctions) =>
  ({ name, city, state, masterApiKey }: CreateCallCenterInput) => {
    const createCallCenter = () => callCenterRepository.create({ name, city, state })

    const generateHashedApiKey = ({ _id }: CallCenterDocument) =>
      bcryptFunctions
        .genSalt()
        .map((salt) => ({ salt, apiKey: `${_id.toString()}_${uuidv4()}` }))
        .andThen(({ salt, apiKey }) => bcryptFunctions.hash(apiKey, salt).map((hashedKey) => ({ hashedKey, apiKey })))

    const insertApiKeyIntoCallCenter = ({ hashedKey, apiKey }: InsertApiKeyInput) =>
      callCenterRepository.insertApiKey(apiKey.split('_')[0], hashedKey).map(() => apiKey)

    const getCallCenterAndFormatResult = (apiKey: string) =>
      callCenterRepository.findById(apiKey.split('_')[0]).map((callCenter) => ({ ...callCenter, apiKey }))

    return apiKeyFunctions
      .checkMasterApiKey(masterApiKey)
      .asyncAndThen(createCallCenter)
      .andThen(generateHashedApiKey)
      .andThen(insertApiKeyIntoCallCenter)
      .andThen(getCallCenterAndFormatResult)
  }
