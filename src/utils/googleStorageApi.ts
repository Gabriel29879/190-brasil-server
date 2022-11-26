import { Storage } from '@google-cloud/storage'
import { fromPromise, fromThrowable } from 'neverthrow'
import { baseExceptionHandler } from './exceptionHandler'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

export type GoogleStorageApiFunctions = ReturnType<typeof googleStorageApiFunctions>

const createGoogleStorageClient = fromThrowable(
  () => new Storage({ keyFilename: path.join(__dirname, '../../indigo-plate-361422-fe2955a37445.json') }),
  baseExceptionHandler,
)

const fakeGoogleApiResponse = fromPromise(
  (async () => {
    return
  })(),
  baseExceptionHandler,
)

const createBase64Buffer = fromThrowable((uri: string) => Buffer.from(uri, 'base64'), baseExceptionHandler)

export const googleStorageApiFunctions = () => ({
  uploadFile: (uri: string, fileExtension: string, customId: string = uuidv4()) =>
    createGoogleStorageClient()
      .asyncAndThen((googleStorageClient) =>
        createBase64Buffer(uri).asyncAndThen((base64Buffer) =>
          process.env.DISABLE_GOOGLE_API
            ? fakeGoogleApiResponse
            : fromPromise(
                googleStorageClient
                  .bucket('190-brasil')
                  .file(`document-images/${customId}.${fileExtension}`)
                  .save(base64Buffer, { resumable: false }),
                baseExceptionHandler,
              ),
        ),
      )
      .map(() => `document-images/${customId}.${fileExtension}`),
})
