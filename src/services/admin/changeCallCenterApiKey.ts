import { v4 as uuidv4 } from 'uuid'
import { CallCenterRepository } from '@domain/callCenter.repository'
import { BcryptFunctions, exceptionHandler } from '@utils'
import { err, ok } from 'neverthrow'
import { ApiKeyFunctions } from '@utils'
import { CallCenterDocument } from '@domain/callCenter.model'

export type ChangeCallCenterApiKeyFactory = ReturnType<typeof changeCallCenterApiKeyFactory>

export type ChangeCallCenterApiKeyInput = {
  readonly _id: string
  readonly masterApiKey: string
}

type GenerateNewCallCenterApiKeyInput = {
  readonly callCenter: CallCenterDocument
  readonly newApiKey: string
}

export const changeCallCenterApiKeyFactory =
  (callCenterRepository: CallCenterRepository, bcryptFunctions: BcryptFunctions, apiKeyFunctions: ApiKeyFunctions) =>
  ({ _id, masterApiKey }: ChangeCallCenterApiKeyInput) => {
    const findCallCenterById = () =>
      callCenterRepository
        .findById(_id)
        .andThen((callCenter) => (!callCenter ? err(exceptionHandler('No call center found', 404)) : ok(callCenter)))

    const generateNewCallCenterApiKey = (callCenter: CallCenterDocument) => ({
      callCenter,
      newApiKey: `${callCenter._id.toString()}_${uuidv4()}`,
    })

    const hashAndSaveApiKey = ({ callCenter: { name, city, state }, newApiKey }: GenerateNewCallCenterApiKeyInput) =>
      bcryptFunctions
        .genSalt()
        .andThen((salt) => bcryptFunctions.hash(newApiKey, salt))
        .andThen((hashedApiKey) => callCenterRepository.insertApiKey(_id.toString(), hashedApiKey))
        .map(() => ({ name, city, state, newApiKey }))

    return apiKeyFunctions
      .checkMasterApiKey(masterApiKey)
      .asyncAndThen(findCallCenterById)
      .map(generateNewCallCenterApiKey)
      .andThen(hashAndSaveApiKey)
  }
