import { asFunction, asValue } from 'awilix'
import { MongoClient } from 'mongodb'
import { mongoConfig } from './mongo.config'

import { UserCollection, userRepository, UserRepository } from '@domain/user.repository'
import { createUserFactory, CreateUserFactory } from '@services/user/createUser'
import {
  bcryptFunctions,
  BcryptFunctions,
  googleMapsApiFunctions,
  GoogleMapsApiFunctions,
  googleStorageApiFunctions,
  GoogleStorageApiFunctions,
} from '@utils'
import { loginUserFactory, LoginUserFactory } from '@services/user/loginUser'
import { OcurrenceCollection, ocurrenceRepository, OcurrenceRepository } from '@domain/ocurrence.repository'
import { createOcurrenceFactory, CreateOcurrenceFactory } from '@services/user/createOcurrence'
import { getUserOcurrencesFactory, GetUserOcurrencesFactory } from '@services/user/getUserOcurrences'
import { CallCenterCollection, callCenterRepository, CallCenterRepository } from '@domain/callCenter.repository'
import { createCallCenterFactory, CreateCallCenterFactory } from '@services/admin/createCallCenter'
import { changeCallCenterApiKeyFactory, ChangeCallCenterApiKeyFactory } from '@services/admin/changeCallCenterApiKey'
import { apiKeyFunctions, ApiKeyFunctions } from '@utils'
import {
  getCallCenterOcurrencesFactory,
  GetCallCenterOcurrencesFactory,
} from '@services/callCenter/getCallCenterOcurrences'
import { attendOcurrenceFactory, AttendOcurrenceFactory } from '@services/callCenter/attendOcurrence'
import { finishOcurrenceFactory, FinishOcurrenceFactory } from '@services/callCenter/finishOcurrence'
import { getCallCentersFactory, GetCallCentersFactory } from '@services/admin/getCallCenters'
import { getUsersFactory, GetUsersFactory } from '@services/admin/getUsers'
import { validateUsersFactory, ValidateUsersFactory } from '@services/admin/validateUsers'
import { cancelOcurrenceFactory, CancelOcurrenceFactory } from '@services/user/cancelOcurrence'
import { blockUserFactory, BlockUserFactory } from '@services/admin/blockUser'

const { DB_URI } = process.env

declare module 'fastify-awilix' {
  interface Cradle {
    readonly mongoClient: MongoClient
    readonly bcryptFunctions: BcryptFunctions
    readonly apiKeyFunctions: ApiKeyFunctions
    readonly googleMapsApiFunctions: GoogleMapsApiFunctions
    readonly googleStorageApiFunctions: GoogleStorageApiFunctions
    readonly userCollection: UserCollection
    readonly userRepository: UserRepository
    readonly createUser: CreateUserFactory
    readonly loginUser: LoginUserFactory
    readonly ocurrenceCollection: OcurrenceCollection
    readonly ocurrenceRepository: OcurrenceRepository
    readonly createOcurrence: CreateOcurrenceFactory
    readonly cancelOcurrence: CancelOcurrenceFactory
    readonly getOcurrence: GetUserOcurrencesFactory
    readonly callCenterCollection: CallCenterCollection
    readonly callCenterRepository: CallCenterRepository
    readonly createCallCenter: CreateCallCenterFactory
    readonly getCallCenters: GetCallCentersFactory
    readonly getUsers: GetUsersFactory
    readonly changeCallCenterApiKey: ChangeCallCenterApiKeyFactory
    readonly validateUsers: ValidateUsersFactory
    readonly blockUser: BlockUserFactory
    readonly getCallCenterOcurrences: GetCallCenterOcurrencesFactory
    readonly attendOcurrence: AttendOcurrenceFactory
    readonly finishOcurrence: FinishOcurrenceFactory
  }
}

export const createContainer = async () => {
  const mongoConnection = await mongoConfig(DB_URI)

  return {
    mongoClient: asValue(mongoConnection.client),
    bcryptFunctions: asFunction(bcryptFunctions),
    apiKeyFunctions: asFunction(apiKeyFunctions),
    googleMapsApiFunctions: asFunction(googleMapsApiFunctions),
    googleStorageApiFunctions: asFunction(googleStorageApiFunctions),
    userCollection: asValue(mongoConnection.userModel),
    userRepository: asFunction(userRepository),
    createUser: asFunction(createUserFactory),
    loginUser: asFunction(loginUserFactory),
    ocurrenceCollection: asValue(mongoConnection.ocurrenceModel),
    ocurrenceRepository: asFunction(ocurrenceRepository),
    createOcurrence: asFunction(createOcurrenceFactory),
    cancelOcurrence: asFunction(cancelOcurrenceFactory),
    getOcurrence: asFunction(getUserOcurrencesFactory),
    callCenterCollection: asValue(mongoConnection.callCenterModel),
    callCenterRepository: asFunction(callCenterRepository),
    createCallCenter: asFunction(createCallCenterFactory),
    getCallCenters: asFunction(getCallCentersFactory),
    getUsers: asFunction(getUsersFactory),
    changeCallCenterApiKey: asFunction(changeCallCenterApiKeyFactory),
    validateUsers: asFunction(validateUsersFactory),
    blockUser: asFunction(blockUserFactory),
    getCallCenterOcurrences: asFunction(getCallCenterOcurrencesFactory),
    attendOcurrence: asFunction(attendOcurrenceFactory),
    finishOcurrence: asFunction(finishOcurrenceFactory),
  }
}
