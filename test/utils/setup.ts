import { MongoMemoryServer } from 'mongodb-memory-server'

export default async () => {
  await createDBConnection()
}

const createDBConnection = async () => {
  const dbInstance = await MongoMemoryServer.create({
    binary: {
      version: '4.4.13',
      checkMD5: false,
    },
  })

  // eslint-disable-next-line functional/immutable-data
  global.__DB_INSTANCE__ = dbInstance

  // eslint-disable-next-line functional/immutable-data
  process.env.__TEST_DB_URI__ = dbInstance.getUri()
}
