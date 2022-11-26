import { replyResult } from '@config/fastify.config'
import { Type } from '@sinclair/typebox'
import { FastifyPluginAsync } from 'fastify'

const admin: FastifyPluginAsync = async (fastify): Promise<void> => {
  interface ICreateCallCenterRouteArgs {
    readonly Body: {
      readonly name: string
      readonly city: string
      readonly state: string
      readonly masterApiKey: string
    }
  }
  const createCallCenterRouteArgs = {
    schema: {
      body: Type.Object({
        name: Type.String({ minLength: 5 }),
        city: Type.String({ minLength: 2 }),
        state: Type.String({ minLength: 2, maxLength: 2 }),
        masterApiKey: Type.String(),
      }),
    },
  }
  fastify.post<ICreateCallCenterRouteArgs>('/admin/call-center', createCallCenterRouteArgs, async (request, reply) => {
    const { createCallCenter } = fastify.diContainer.cradle

    return replyResult(await createCallCenter(request.body), reply)
  })

  interface IChangeCallCenterApiKeyRouteArgs {
    readonly Body: {
      readonly _id: string
      readonly masterApiKey: string
    }
  }
  const changeCallCenterApiKeyRouteArgs = {
    schema: {
      body: Type.Object({
        _id: Type.String({ minLength: 24, maxLength: 24 }),
        masterApiKey: Type.String(),
      }),
    },
  }
  fastify.put<IChangeCallCenterApiKeyRouteArgs>(
    '/admin/change-call-center-api-key',
    changeCallCenterApiKeyRouteArgs,
    async (request, reply) => {
      const { changeCallCenterApiKey } = fastify.diContainer.cradle

      return replyResult(await changeCallCenterApiKey(request.body), reply)
    },
  )

  interface IGetCallCentersRouteArgs {
    readonly Querystring: {
      readonly _id: string
      readonly skip: number
      readonly masterApiKey: string
    }
  }
  const getCallCentersRouteArgs = {
    schema: {
      querystring: Type.Object({
        _id: Type.Optional(Type.String({ minLength: 24, maxLength: 24 })),
        skip: Type.Number(),
        masterApiKey: Type.String(),
      }),
    },
  }
  fastify.get<IGetCallCentersRouteArgs>('/admin/call-center', getCallCentersRouteArgs, async (request, reply) => {
    const { getCallCenters } = fastify.diContainer.cradle

    return replyResult(await getCallCenters(request.query), reply)
  })

  interface IGetUsersRouteArgs {
    readonly Querystring: {
      readonly _id: string
      readonly skip: number
      readonly masterApiKey: string
    }
  }
  const getUsersRouteArgs = {
    schema: {
      querystring: Type.Object({
        _id: Type.Optional(Type.String({ minLength: 24, maxLength: 24 })),
        skip: Type.Number(),
        masterApiKey: Type.String(),
      }),
    },
  }
  fastify.get<IGetUsersRouteArgs>('/admin/user', getUsersRouteArgs, async (request, reply) => {
    const { getUsers } = fastify.diContainer.cradle

    return replyResult(await getUsers(request.query), reply)
  })

  interface IValidateUsersRouteArgs {
    readonly Body: {
      readonly userIds: readonly string[]
      readonly masterApiKey: string
    }
  }
  const validateUsersRouteArgs = {
    schema: {
      body: Type.Object({
        userIds: Type.Array(Type.String({ minLength: 24, maxLength: 24 })),
        masterApiKey: Type.String(),
      }),
    },
  }
  fastify.put<IValidateUsersRouteArgs>('/admin/validate-users', validateUsersRouteArgs, async (request, reply) => {
    const { validateUsers } = fastify.diContainer.cradle

    return replyResult(await validateUsers(request.body), reply)
  })

  interface IBlockUserRouteArgs {
    readonly Body: {
      readonly _id: string
      readonly masterApiKey: string
    }
  }
  const blockUserRouteArgs = {
    schema: {
      body: Type.Object({
        _id: Type.String({ minLength: 24, maxLength: 24 }),
        masterApiKey: Type.String(),
      }),
    },
  }
  fastify.put<IBlockUserRouteArgs>('/admin/block-user', blockUserRouteArgs, async (request, reply) => {
    const { blockUser } = fastify.diContainer.cradle

    return replyResult(await blockUser(request.body), reply)
  })
}

export default admin
