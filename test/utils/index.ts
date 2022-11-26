/* eslint-disable functional/no-try-statement */
import { asFunction, asValue } from 'awilix'
import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import AutoLoad from 'fastify-autoload'
import FastifyJWTPlugin from '@fastify/jwt'
import { diContainer, fastifyAwilixPlugin } from 'fastify-awilix/lib/classic'
import fp from 'fastify-plugin'
import { MongoClient } from 'mongodb'
import Papr from 'papr'
import { join } from 'path'

import { userSchema } from '@domain/user.model'
import { userRepository } from '@domain/user.repository'
import { createUserFactory } from '@services/user/createUser'
import { apiKeyFunctions, bcryptFunctions, googleMapsApiFunctions, googleStorageApiFunctions } from '@utils'
import { loginUserFactory } from '@services/user/loginUser'
import { ocurrenceRepository } from '@domain/ocurrence.repository'
import { createOcurrenceFactory } from '@services/user/createOcurrence'
import { getUserOcurrencesFactory } from '@services/user/getUserOcurrences'
import { ocurrenceSchema } from '@domain/ocurrence.model'
import { callCenterRepository } from '@domain/callCenter.repository'
import { createCallCenterFactory } from '@services/admin/createCallCenter'
import { getCallCentersFactory } from '@services/admin/getCallCenters'
import { getUsersFactory } from '@services/admin/getUsers'
import { changeCallCenterApiKeyFactory } from '@services/admin/changeCallCenterApiKey'
import { validateUsersFactory } from '@services/admin/validateUsers'
import { getCallCenterOcurrencesFactory } from '@services/callCenter/getCallCenterOcurrences'
import { attendOcurrenceFactory } from '@services/callCenter/attendOcurrence'
import { finishOcurrenceFactory } from '@services/callCenter/finishOcurrence'
import { callCenterSchema } from '@domain/callCenter.model'
import { cancelOcurrenceFactory } from '@services/user/cancelOcurrence'
import { blockUserFactory } from '@services/admin/blockUser'

export const setupTestGlobals = async (dbName: string) => {
  await dbSetup(dbName)
  await appSetup()
}

const dbSetup = async (dbName: string) => {
  // eslint-disable-next-line functional/immutable-data
  global.__TEST_DB_CLIENT__ = await MongoClient.connect(process.env.__TEST_DB_URI__)

  const papr = new Papr()
  papr.initialize(global.__TEST_DB_CLIENT__.db(dbName))

  // eslint-disable-next-line functional/immutable-data
  global.__TEST_USER_COLLECTION__ = papr.model('user', userSchema)
  // eslint-disable-next-line functional/immutable-data
  global.__TEST_OCURRENCE_COLLECTION__ = papr.model('ocurrence', ocurrenceSchema)
  // eslint-disable-next-line functional/immutable-data
  global.__TEST_CALL_CENTER_COLLECTION = papr.model('callCenter', callCenterSchema)
}

const appSetup = async () => {
  const app = Fastify()

  diContainer.register({
    mongoClient: asValue(global.__TEST_DB_CLIENT__),
    bcryptFunctions: asFunction(bcryptFunctions),
    apiKeyFunctions: asFunction(apiKeyFunctions),
    googleMapsApiFunctions: asFunction(googleMapsApiFunctions),
    googleStorageApiFunctions: asFunction(googleStorageApiFunctions),
    userCollection: asValue(global.__TEST_USER_COLLECTION__),
    userRepository: asFunction(userRepository),
    createUser: asFunction(createUserFactory),
    loginUser: asFunction(loginUserFactory),
    ocurrenceCollection: asValue(global.__TEST_OCURRENCE_COLLECTION__),
    ocurrenceRepository: asFunction(ocurrenceRepository),
    createOcurrence: asFunction(createOcurrenceFactory),
    cancelOcurrence: asFunction(cancelOcurrenceFactory),
    getOcurrence: asFunction(getUserOcurrencesFactory),
    callCenterCollection: asValue(global.__TEST_CALL_CENTER_COLLECTION),
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
  })

  app.register(async (fastify, opts) => {
    fastify.register(AutoLoad, {
      dir: join(__dirname, '../../src/routes'),
      options: opts,
    })

    fastify.register(
      fp(async (fastify) => {
        fastify.register(fastifyAwilixPlugin, {
          disposeOnClose: true,
          disposeOnResponse: false,
        })
      }),
    )

    fastify.register(FastifyJWTPlugin, {
      secret: process.env.JWT_SECRET,
    })

    fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
    })
  })

  await app.ready()

  // eslint-disable-next-line functional/immutable-data
  global.__TEST_APP__ = app

  // eslint-disable-next-line functional/immutable-data
  global.__TEST_DI_CRADDLE__ = diContainer
}

export const clearDB = async () => {
  await global.__TEST_USER_COLLECTION__.deleteMany({})
  await global.__TEST_OCURRENCE_COLLECTION__.deleteMany({})
  await global.__TEST_CALL_CENTER_COLLECTION.deleteMany({})
}

export const closeConnections = async () => {
  await global.__TEST_DB_CLIENT__.close()
}
