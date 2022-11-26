import { CallCenterDocument } from '@domain/callCenter.model'
import { OcurrenceDocument, OcurrenceStatusEnum } from '@domain/ocurrence.model'
import { OcurrenceRepository } from '@domain/ocurrence.repository'
import { ApiKeyFunctions, exceptionHandler } from '@utils'
import { err, ok } from 'neverthrow'

export type AttendOcurrenceFactory = ReturnType<typeof attendOcurrenceFactory>

export type AttendOcurrenceInput = {
  readonly _id: string
  readonly callCenterApiKey: string
}

type OcurrenceAndCallCenterDocumentObj = {
  readonly callCenter: CallCenterDocument
  readonly ocurrence: OcurrenceDocument
}

type GetOcurrenceByIdInput = {
  readonly callCenter: CallCenterDocument
  readonly unHashedApiKey: string
}

export const attendOcurrenceFactory =
  (ocurrenceRepository: OcurrenceRepository, apiKeyFunctions: ApiKeyFunctions) =>
  ({ callCenterApiKey, _id }: AttendOcurrenceInput) => {
    const getOcurrenceById = ({ callCenter }: GetOcurrenceByIdInput) =>
      ocurrenceRepository
        .findById(_id)
        .andThen((ocurrence) => {
          if (!ocurrence) return err(exceptionHandler('Ocurrence not found', 404))
          return ok(ocurrence)
        })
        .map((ocurrence) => ({ callCenter, ocurrence }))

    const validateOperation = ({ callCenter, ocurrence }: OcurrenceAndCallCenterDocumentObj) => {
      if (callCenter.state !== ocurrence.state)
        return err(exceptionHandler('Not allowed to attend ocurrence from another state', 401))

      if (ocurrence.status !== OcurrenceStatusEnum.PENDING)
        return err(exceptionHandler('Not allowed to attend ocurrence that is not pending', 401))

      return ok(callCenter)
    }

    const attendOcurrence = (callCenter: CallCenterDocument) => ocurrenceRepository.attendOcurrence(_id, callCenter)

    return apiKeyFunctions
      .checkCallCenterApiKey(callCenterApiKey)
      .andThen(getOcurrenceById)
      .andThen(validateOperation)
      .andThen(attendOcurrence)
  }
