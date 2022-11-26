import { callCenterSchema } from '@domain/callCenter.model'
import { ocurrenceSchema } from '@domain/ocurrence.model'
import { userSchema } from '@domain/user.model'
import { MongoClient } from 'mongodb'
import Papr from 'papr'

export const mongoConfig = async (dbUrl: string) => {
  const papr = new Papr()
  const client = await MongoClient.connect(dbUrl)

  papr.initialize(client.db())

  const userModel = papr.model('user', userSchema)
  const ocurrenceModel = papr.model('ocurrence', ocurrenceSchema)
  const callCenterModel = papr.model('callCenter', callCenterSchema)

  await papr.updateSchemas()

  async function disconnect() {
    await client.close()
  }

  return {
    client,
    disconnect,
    userModel,
    ocurrenceModel,
    callCenterModel,
  }
}
