import { createContainer } from '@config/di.config'
import { diContainer, FastifyAwilixOptions, fastifyAwilixPlugin } from 'fastify-awilix/lib/classic'
import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify-typebox'

export default fp<FastifyAwilixOptions>(
  async (fastify: FastifyInstance) => {
    void diContainer.register(await createContainer())

    await fastify.register(fastifyAwilixPlugin, {
      disposeOnClose: true,
      disposeOnResponse: false,
    })
  },
  { name: 'container' },
)
