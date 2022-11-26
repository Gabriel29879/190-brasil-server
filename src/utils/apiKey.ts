import { CallCenterDocument } from '@domain/callCenter.model'
import { CallCenterRepository } from '@domain/callCenter.repository'
import { err, ok, Result } from 'neverthrow'
import { BcryptFunctions } from './bcrypt'
import { BaseError, exceptionHandler } from './exceptionHandler'

export type ApiKeyFunctions = ReturnType<typeof apiKeyFunctions>

type CompareApiKeysInput = {
  readonly callCenter: CallCenterDocument
  readonly unHashedApiKey: string
}

export const apiKeyFunctions = (callCenterRepository: CallCenterRepository, bcryptFunctions: BcryptFunctions) => {
  const findCallCenterById = (apiKey: string) =>
    callCenterRepository
      .findById(apiKey.split('_')[0])
      .andThen((callCenter) =>
        callCenter ? ok({ callCenter, unHashedApiKey: apiKey }) : err(exceptionHandler('Unauthorized', 401)),
      )

  const compareApiKeys = ({ callCenter, unHashedApiKey }: CompareApiKeysInput) =>
    bcryptFunctions.compare(callCenter.apiKey, unHashedApiKey).map(() => ({ callCenter, unHashedApiKey }))

  return {
    checkMasterApiKey: (masterApiKey: string): Result<string, BaseError> =>
      masterApiKey === process.env.MASTER_API_KEY ? ok(masterApiKey) : err(exceptionHandler('Unauthorized', 401)),
    checkCallCenterApiKey: (apiKey: string) => findCallCenterById(apiKey).andThen(compareApiKeys),
  }
}
