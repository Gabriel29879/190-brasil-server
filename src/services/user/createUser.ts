import { UserRepository } from '@domain/user.repository'
import { BcryptFunctions, GoogleStorageApiFunctions } from '@utils'

export type CreateUserFactory = ReturnType<typeof createUserFactory>

export type CreateUserInput = {
  readonly cpf: string
  readonly name: string
  readonly email: string
  readonly password: string
  readonly faceAndDocumentPhotoData: {
    readonly uri: string
    readonly fileExtension: string
  }
}

export const createUserFactory =
  (
    userRepository: UserRepository,
    bcryptFunctions: BcryptFunctions,
    googleStorageApiFunctions: GoogleStorageApiFunctions,
  ) =>
  ({ cpf, email, faceAndDocumentPhotoData: { uri, fileExtension }, name, password }: CreateUserInput) =>
    bcryptFunctions
      .genSalt()
      .andThen((salt) => bcryptFunctions.hash(password, salt))
      .andThen((hashedPassword) =>
        googleStorageApiFunctions
          .uploadFile(uri, fileExtension)
          .andThen((faceAndDocumentPhotoPath) =>
            userRepository.create({ cpf, email, name, password: hashedPassword, faceAndDocumentPhotoPath }),
          ),
      )
