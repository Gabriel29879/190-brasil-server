import 'dotenv/config'
import server from '@config/fastify.config'
import { baseExceptionHandler } from '@utils/exceptionHandler'
import { fromPromise } from 'neverthrow'

const start = async () => {
  server.log.info('Starting server...')

  const { PORT, LOCAL_ENV } = process.env

  const serverStart = await fromPromise(
    server.listen(PORT ? PORT : 3000, LOCAL_ENV ? undefined : '0.0.0.0'),
    baseExceptionHandler,
  )

  if (serverStart.isErr()) {
    server.log.error(serverStart.error)
    process.exit(1)
  }
}

start()
