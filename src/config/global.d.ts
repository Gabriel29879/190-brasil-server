import { CallCenterCollection } from '@domain/callCenter.repository'
import { OcurrenceCollection } from '@domain/ocurrence.repository'
import { UserCollection } from '@domain/user.repository'
import { AwilixContainer } from 'awilix'
import { FastifyInstance, FastifyLoggerInstance } from 'fastify'
import { Cradle } from 'fastify-awilix'
import { IncomingMessage, Server, ServerResponse } from 'http'
import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

/* eslint-disable no-var */
export declare global {
  var __DB_INSTANCE__: MongoMemoryServer
  var __TEST_DB_CLIENT__: MongoClient
  var __TEST_APP__: FastifyInstance<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance>
  var __TEST_DI_CRADDLE__: AwilixContainer<Cradle>
  var __TEST_USER_COLLECTION__: UserCollection
  var __TEST_OCURRENCE_COLLECTION__: OcurrenceCollection
  var __TEST_CALL_CENTER_COLLECTION: CallCenterCollection
  var __TEST_JWT__: string
}
