/* eslint-disable functional/no-try-statement */
/* eslint-disable functional/immutable-data */

import fp from 'fastify-plugin'
import FastifyJWTPlugin from '@fastify/jwt'
import { FastifyReply, FastifyRequest } from 'fastify'

export default fp(async function (fastify) {
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
