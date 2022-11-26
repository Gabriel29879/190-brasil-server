import { baseExceptionHandler } from '@utils/exceptionHandler'
import { ObjectId } from 'mongodb'
import { fromPromise } from 'neverthrow'
import { Model } from 'papr'
import { CallCenterDocument } from './callCenter.model'
import { OcurrenceDocument, OcurrenceStatusEnum, OcurrenceTypeEnum } from './ocurrence.model'

export type OcurrenceCollection = Model<OcurrenceDocument, Partial<OcurrenceDocument>>

export type OcurrenceRepository = ReturnType<typeof ocurrenceRepository>

type OcurrenceAndUser = {
  readonly latitude: number
  readonly longitude: number
  readonly type: OcurrenceTypeEnum
  readonly description?: string
  readonly fullAddress: string
  readonly city: string
  readonly state: string
  readonly user: {
    readonly _id: ObjectId
    readonly name: string
    readonly cpf: string
    readonly email: string
    readonly faceAndDocumentPhotoPath?: string
  }
}

type GetOcurrenceArgs = {
  readonly skip?: number
  readonly _id?: string
  readonly userId?: string
  readonly status?: OcurrenceStatusEnum
  readonly state?: string
}

export const ocurrenceRepository = (ocurrenceCollection: OcurrenceCollection) => ({
  create: (ocurrenceAndUser: OcurrenceAndUser) =>
    fromPromise(
      ocurrenceCollection.insertOne({ ...ocurrenceAndUser, status: OcurrenceStatusEnum.PENDING }),
      baseExceptionHandler,
    ),
  findById: (_id: string) =>
    fromPromise(ocurrenceCollection.findById(ObjectId.createFromHexString(_id)), baseExceptionHandler),
  get: ({ _id, userId, status, state, skip = 5 }: GetOcurrenceArgs) =>
    fromPromise(
      ocurrenceCollection.find(
        {
          ...(_id ? { _id: ObjectId.createFromHexString(_id) } : []),
          ...(userId ? { 'user._id': ObjectId.createFromHexString(userId) } : []),
          ...(status ? { status } : []),
          ...(state ? { state } : []),
        },
        { skip, limit: 5, sort: { createdAt: -1 } },
      ),
      baseExceptionHandler,
    ),
  attendOcurrence: (_id: string, callCenter: CallCenterDocument) =>
    fromPromise(
      ocurrenceCollection.updateOne(
        { _id: ObjectId.createFromHexString(_id) },
        {
          $set: {
            status: OcurrenceStatusEnum.IN_ATTENDANCE,
            callCenter: {
              _id: callCenter._id,
              name: callCenter.name,
              city: callCenter.city,
              state: callCenter.state,
            },
          },
        },
      ),
      baseExceptionHandler,
    ),
  finishOcurrence: (_id: string) =>
    fromPromise(
      ocurrenceCollection.updateOne(
        { _id: ObjectId.createFromHexString(_id) },
        { $set: { status: OcurrenceStatusEnum.FINISHED } },
      ),
      baseExceptionHandler,
    ),
  cancelOcurrence: (cancellationReason: string, _id: string) =>
    fromPromise(
      ocurrenceCollection.updateOne(
        { _id: ObjectId.createFromHexString(_id) },
        { $set: { cancellationReason, status: OcurrenceStatusEnum.CANCELLED } },
      ),
      baseExceptionHandler,
    ),
})
