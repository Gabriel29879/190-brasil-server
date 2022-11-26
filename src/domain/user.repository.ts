import { baseExceptionHandler } from '@utils/exceptionHandler'
import { ObjectId } from 'mongodb'
import { fromPromise } from 'neverthrow'
import { Model } from 'papr'
import { UserDocument } from './user.model'

export type UserCollection = Model<UserDocument, Partial<UserDocument>>

export type UserRepository = ReturnType<typeof userRepository>

type GetUsersArgs = {
  readonly _id: string
  readonly skip: number
}

type CreateUserInput = {
  readonly name: string
  readonly cpf: string
  readonly password: string
  readonly email: string
  readonly faceAndDocumentPhotoPath: string
}

export const userRepository = (userCollection: UserCollection) => ({
  create: (user: CreateUserInput) =>
    fromPromise(userCollection.insertOne({ ...user, isValidated: false }), baseExceptionHandler).map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ password, ...user }) => user,
    ),
  findByCpf: (cpf: string) => fromPromise(userCollection.findOne({ cpf }), baseExceptionHandler),
  findById: (_id: string) =>
    fromPromise(userCollection.findById(ObjectId.createFromHexString(_id)), baseExceptionHandler),
  get: ({ _id, skip }: GetUsersArgs) =>
    fromPromise(
      userCollection.find(
        {
          ...(_id ? { _id: ObjectId.createFromHexString(_id) } : []),
        },
        { skip, limit: 5 },
      ),
      baseExceptionHandler,
    ),
  validateUsers: (userIds: readonly string[]) =>
    fromPromise(
      userCollection.updateMany(
        { _id: { $in: userIds.map((userId) => ObjectId.createFromHexString(userId)) } },
        { $set: { isValidated: true } },
      ),
      baseExceptionHandler,
    ),
  blockUser: (_id: string) =>
    fromPromise(
      userCollection.updateOne({ _id: ObjectId.createFromHexString(_id) }, { $set: { isValidated: false } }),
      baseExceptionHandler,
    ),
})
