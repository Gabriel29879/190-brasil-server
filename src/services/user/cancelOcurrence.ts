import { OcurrenceStatusEnum } from '@domain/ocurrence.model'
import { OcurrenceRepository } from '@domain/ocurrence.repository'
import { exceptionHandler } from '@utils'
import { err, ok } from 'neverthrow'

export type CancelOcurrenceFactory = ReturnType<typeof cancelOcurrenceFactory>

export type CancelOcurrenceInput = {
  readonly _id: string
  readonly cancellationReason: string
  readonly userId: string
}

export const cancelOcurrenceFactory =
  (ocurrenceRepository: OcurrenceRepository) =>
  ({ _id, cancellationReason, userId }: CancelOcurrenceInput) =>
    ocurrenceRepository
      .findById(_id)
      .andThen((ocurrence) => {
        if (!ocurrence) return err(exceptionHandler('Ocurrence not found', 404))
        if (ocurrence.status === OcurrenceStatusEnum.FINISHED || ocurrence.status === OcurrenceStatusEnum.CANCELLED) {
          return err(exceptionHandler(`Cannot cancel ocurrence with status ${ocurrence.status.toLowerCase()}`, 400))
        }
        if (ocurrence.user._id.toString() !== userId) {
          return err(exceptionHandler('Not authorized to execute this operation', 401))
        }
        return ok(ocurrence)
      })
      .andThen(() => ocurrenceRepository.cancelOcurrence(cancellationReason, _id))
