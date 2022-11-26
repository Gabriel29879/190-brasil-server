import { replyResult } from '@config/fastify.config'
import { Type } from '@sinclair/typebox'
import { FastifyPluginAsync } from 'fastify'
import { OcurrenceStatusEnum } from '@domain/ocurrence.model'

const callCenter: FastifyPluginAsync = async (fastify): Promise<void> => {
  interface IGetCallCenterOcurrencesRouteArgs {
    readonly Querystring: {
      readonly _id: string
      readonly userId: string
      readonly status: OcurrenceStatusEnum
      readonly skip: number
      readonly callCenterApiKey: string
    }
  }
  const getCallCenterOcurrencesRouteArgs = {
    schema: {
      querystring: Type.Object({
        _id: Type.Optional(Type.String({ minLength: 24, maxLength: 24 })),
        userId: Type.Optional(Type.String({ minLength: 24, maxLength: 24 })),
        status: Type.Optional(Type.String()),
        skip: Type.Number(),
        callCenterApiKey: Type.String(),
      }),
    },
  }
  fastify.get<IGetCallCenterOcurrencesRouteArgs>(
    '/call-center/ocurrence',
    getCallCenterOcurrencesRouteArgs,
    async (request, reply) => {
      const { getCallCenterOcurrences } = fastify.diContainer.cradle

      return replyResult(await getCallCenterOcurrences(request.query), reply)
    },
  )

  interface IAttendOcurrenceRouteArgs {
    readonly Body: {
      readonly _id: string
      readonly callCenterApiKey: string
    }
  }
  const attendOcurrenceRouteArgs = {
    schema: {
      body: Type.Object({
        _id: Type.String(),
        callCenterApiKey: Type.String(),
      }),
    },
  }
  fastify.put<IAttendOcurrenceRouteArgs>(
    '/call-center/attend-ocurrence',
    attendOcurrenceRouteArgs,
    async (request, reply) => {
      const { attendOcurrence } = fastify.diContainer.cradle

      return replyResult(await attendOcurrence(request.body), reply)
    },
  )

  interface IFinishOcurrenceRouteArgs {
    readonly Body: {
      readonly _id: string
      readonly callCenterApiKey: string
    }
  }
  const finishOcurrenceRouteArgs = {
    schema: {
      body: Type.Object({
        _id: Type.String(),
        callCenterApiKey: Type.String(),
      }),
    },
  }
  fastify.put<IFinishOcurrenceRouteArgs>(
    '/call-center/finish-ocurrence',
    finishOcurrenceRouteArgs,
    async (request, reply) => {
      const { finishOcurrence } = fastify.diContainer.cradle

      return replyResult(await finishOcurrence(request.body), reply)
    },
  )
}

export default callCenter
