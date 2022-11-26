import { replyResult } from '@config/fastify.config'
import { OcurrenceTypeEnum } from '@domain/ocurrence.model'
import { CancelOcurrenceInput } from '@services/user/cancelOcurrence'
import { CreateOcurrenceInput } from '@services/user/createOcurrence'
import { CreateUserInput } from '@services/user/createUser'
import { UserCredentials } from '@services/user/loginUser'
import { Type } from '@sinclair/typebox'
import { FastifyPluginAsync } from 'fastify'

type JwtTokenParams = {
  readonly _id: string
}

const user: FastifyPluginAsync = async (fastify): Promise<void> => {
  interface ICreateUserParams {
    readonly Body: CreateUserInput
  }
  const createUserSchema = {
    schema: {
      body: Type.Object({
        cpf: Type.String({ minLength: 11, maxLength: 11 }),
        name: Type.String({ minLength: 5 }),
        password: Type.String({ minLength: 5 }),
        email: Type.String({ format: 'email' }),
        faceAndDocumentPhotoData: Type.Object({
          uri: Type.String(),
          fileExtension: Type.String(),
        }),
      }),
    },
  }
  fastify.post<ICreateUserParams>('/user', createUserSchema, async (request, reply) => {
    const { createUser } = fastify.diContainer.cradle

    return replyResult(await createUser(request.body), reply)
  })

  interface ILoginUserParams {
    readonly Body: UserCredentials
  }
  const loginUserSchema = {
    schema: {
      body: Type.Object({
        cpf: Type.String({ minLength: 11, maxLength: 11 }),
        password: Type.String({ minLength: 5 }),
      }),
    },
  }
  fastify.post<ILoginUserParams>('/user/login', loginUserSchema, async (request, reply) => {
    const { loginUser } = fastify.diContainer.cradle

    return replyResult(await loginUser(request.body, fastify), reply)
  })

  interface ICreateOcurrenceRoute {
    readonly Body: CreateOcurrenceInput
  }
  const createOcurrenceRouteArgs = {
    schema: {
      body: Type.Object({
        latitude: Type.Number(),
        longitude: Type.Number(),
        type: Type.Enum(OcurrenceTypeEnum),
        description: Type.Optional(Type.String()),
      }),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: [(fastify as any).authenticate],
  }
  fastify.post<ICreateOcurrenceRoute>('/user/ocurrence', createOcurrenceRouteArgs, async (request, reply) => {
    const { createOcurrence } = fastify.diContainer.cradle

    return replyResult(await createOcurrence({ ...request.body, userId: (request.user as JwtTokenParams)._id }), reply)
  })

  interface ICancelOcurrenceRoute {
    readonly Body: CancelOcurrenceInput
  }
  const cancelOcurrenceRouteArgs = {
    schema: {
      body: Type.Object({
        _id: Type.String({ minLength: 24, maxLength: 24 }),
        cancellationReason: Type.String(),
      }),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: [(fastify as any).authenticate],
  }
  fastify.put<ICancelOcurrenceRoute>('/user/ocurrence/cancel', cancelOcurrenceRouteArgs, async (request, reply) => {
    const { cancelOcurrence } = fastify.diContainer.cradle

    return replyResult(await cancelOcurrence({ ...request.body, userId: (request.user as JwtTokenParams)._id }), reply)
  })

  interface IGetUserOcurrencesRoute {
    readonly Querystring: {
      readonly skip: number
      readonly _id: string
    }
  }
  const getUserOcurrencesRouteArgs = {
    schema: {
      querystring: Type.Object({
        skip: Type.Number(),
        _id: Type.Optional(Type.String({ minLength: 24, maxLength: 24 })),
      }),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: [(fastify as any).authenticate],
  }
  fastify.get<IGetUserOcurrencesRoute>('/user/ocurrence', getUserOcurrencesRouteArgs, async (request, reply) => {
    const { getOcurrence } = fastify.diContainer.cradle

    return replyResult(await getOcurrence({ ...request.query, userId: (request.user as JwtTokenParams)._id }), reply)
  })
}

export default user
