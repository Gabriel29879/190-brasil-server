import { baseExceptionHandler } from '@utils/exceptionHandler'
import { ObjectId } from 'mongodb'
import { fromPromise } from 'neverthrow'
import { Model } from 'papr'
import { CallCenterDocument } from './callCenter.model'

export type CallCenterCollection = Model<CallCenterDocument, Partial<CallCenterDocument>>

export type CallCenterRepository = ReturnType<typeof callCenterRepository>

type CreateCallCenterInput = {
  readonly name: string
  readonly city: string
  readonly state: string
}

type GetCallCenterArgs = {
  readonly _id: string
  readonly skip: number
}

export const callCenterRepository = (callCenterCollection: CallCenterCollection) => ({
  create: (createCallCenterInput: CreateCallCenterInput) =>
    fromPromise(callCenterCollection.insertOne(createCallCenterInput), baseExceptionHandler),
  findById: (_id: string) =>
    fromPromise(callCenterCollection.findById(ObjectId.createFromHexString(_id)), baseExceptionHandler),
  get: ({ _id, skip }: GetCallCenterArgs) =>
    fromPromise(
      callCenterCollection.find(
        {
          ...(_id ? { _id: ObjectId.createFromHexString(_id) } : []),
        },
        { skip, limit: 5 },
      ),
      baseExceptionHandler,
    ),
  insertApiKey: (_id: string, apiKey: string) =>
    fromPromise(
      callCenterCollection.updateOne({ _id: ObjectId.createFromHexString(_id) }, { $set: { apiKey } }),
      baseExceptionHandler,
    ),
})
