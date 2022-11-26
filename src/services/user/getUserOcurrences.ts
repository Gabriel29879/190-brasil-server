import { OcurrenceRepository } from '@domain/ocurrence.repository'

export type GetUserOcurrencesFactory = ReturnType<typeof getUserOcurrencesFactory>

export type GetUserOcurrencesInput = {
  readonly skip: number
  readonly _id: string
  readonly userId: string
}

export const getUserOcurrencesFactory =
  (ocurrenceRepository: OcurrenceRepository) => (getUserOcurrencesInput: GetUserOcurrencesInput) =>
    ocurrenceRepository.get(getUserOcurrencesInput)
