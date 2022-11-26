import { CallCenterDocument } from '@domain/callCenter.model'
import { OcurrenceDocument, OcurrenceStatusEnum } from '@domain/ocurrence.model'
import { OcurrenceRepository } from '@domain/ocurrence.repository'
import { ApiKeyFunctions, exceptionHandler } from '@utils'
import { err, ok } from 'neverthrow'

export type FinishOcurrenceFactory = ReturnType<typeof finishOcurrenceFactory>

export type finishOcurrenceInput = {
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

export const finishOcurrenceFactory =
  (ocurrenceRepository: OcurrenceRepository, apiKeyFunctions: ApiKeyFunctions) =>
  ({ callCenterApiKey, _id }: finishOcurrenceInput) => {
    const getOcurrenceById = ({ callCenter }: GetOcurrenceByIdInput) =>
      ocurrenceRepository
        .findById(_id)
        .andThen((ocurrence) => {
          if (!ocurrence) return err(exceptionHandler('Ocurrence not found', 404))
          return ok(ocurrence)
        })
        .map((ocurrence) => ({ callCenter, ocurrence }))

    const validateOperation = ({ callCenter, ocurrence }: OcurrenceAndCallCenterDocumentObj) => {
      if (ocurrence.status !== OcurrenceStatusEnum.IN_ATTENDANCE)
        return err(exceptionHandler('Not allowed to finish ocurrence that is not in attendance', 401))

      if (callCenter._id.toString() !== ocurrence.callCenter?._id.toString())
        return err(exceptionHandler('Not allowed to finish ocurrence from another call center', 401))

      return ok(callCenter)
    }

    const finishOcurrence = () => ocurrenceRepository.finishOcurrence(_id)

    return apiKeyFunctions
      .checkCallCenterApiKey(callCenterApiKey)
      .andThen(getOcurrenceById)
      .andThen(validateOperation)
      .andThen(finishOcurrence)
  }
