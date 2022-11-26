import Fastify, { FastifyReply } from 'fastify'
import AutoLoad from 'fastify-autoload'
import { nanoid } from 'nanoid'
import { Result } from 'neverthrow'
import { join } from 'path'
import { logger } from './logger.config'

const xRequestId = 'x-request-id'

const fastifyInstance = Fastify({
  genReqId: (req) => {
    const serverReqId = req.headers[xRequestId] as string | undefined
    if (serverReqId) return serverReqId
    return nanoid()
  },
  logger: logger,
})

fastifyInstance.register(async (fastify, opts) => {
  fastify.register(AutoLoad, {
    dir: join(__dirname, './plugins'),
    options: opts,
  })

  fastify.register(AutoLoad, {
    dir: join(__dirname, '../routes'),
    options: opts,
  })
})

fastifyInstance.addHook('onSend', (_request, reply, payload, next) => {
  // eslint-disable-next-line functional/immutable-data
  Object.assign(reply.raw, { customLog: { payload } })
  next()
})

fastifyInstance.addHook('preHandler', (request, _reply, done) => {
  // eslint-disable-next-line functional/immutable-data
  request.log.info({ requestBody: request.body })
  done()
})

export const replyResult = <T>(result: Result<T, unknown>, res: FastifyReply) => {
  if (result.isOk()) {
    return result.value
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((result as any).error?.customError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return res.status((result as any).error?.statusCode || 500).send((result as any).error?.message)
    }
    return res.status(500).send(result.error)
  }
}

export default fastifyInstance
