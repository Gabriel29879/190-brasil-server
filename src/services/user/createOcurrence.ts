import { OcurrenceTypeEnum } from '@domain/ocurrence.model'
import { OcurrenceRepository } from '@domain/ocurrence.repository'
import { UserDocument } from '@domain/user.model'
import { UserRepository } from '@domain/user.repository'
import { exceptionHandler } from '@utils'
import { GoogleMapsApiFunctions } from '@utils/googleMapsApi'
import { err, ok } from 'neverthrow'

export type CreateOcurrenceFactory = ReturnType<typeof createOcurrenceFactory>

export type CreateOcurrenceInput = {
  readonly userId: string
  readonly latitude: number
  readonly longitude: number
  readonly type: OcurrenceTypeEnum
  readonly description?: string
}

type OcurrenceLocation = {
  readonly city: string
  readonly state: string
  readonly fullAddress: string
}

type CreateOcurrenceFlow = {
  readonly user: UserDocument
  readonly ocurrenceLocation: OcurrenceLocation
}

export const createOcurrenceFactory =
  (
    userRepository: UserRepository,
    ocurrenceRepository: OcurrenceRepository,
    googleMapsApiFunctions: GoogleMapsApiFunctions,
  ) =>
  ({ userId, latitude, longitude, type, description }: CreateOcurrenceInput) => {
    const getOcurrenceOriginLocation = (user: UserDocument) =>
      googleMapsApiFunctions
        .getGeocodeLocation(latitude, longitude)
        .map((ocurrenceLocation) => ({ user, ocurrenceLocation }))

    const checkIfUserIsValidated = () =>
      userRepository.findById(userId).andThen((user) => {
        return !user?.isValidated
          ? err(exceptionHandler('User does not have permission to create an ocurrence', 401))
          : ok(user)
      })

    const createOcurrence = ({
      user: { _id, cpf, email, name, faceAndDocumentPhotoPath },
      ocurrenceLocation: { city, fullAddress, state },
    }: CreateOcurrenceFlow) =>
      ocurrenceRepository.create({
        city,
        fullAddress,
        state,
        latitude,
        longitude,
        type,
        description,
        user: { _id, cpf, email, name, faceAndDocumentPhotoPath },
      })

    return checkIfUserIsValidated().andThen(getOcurrenceOriginLocation).andThen(createOcurrence)
  }
