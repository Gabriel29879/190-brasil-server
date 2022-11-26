import { schema, types } from 'papr'

export enum OcurrenceStatusEnum {
  PENDING = 'PENDING',
  IN_ATTENDANCE = 'IN_ATTENDANCE',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export enum OcurrenceTypeEnum {
  EMERGENCY = 'EMERGENCY',
  THEFT = 'THEFT',
  PERTURBATION = 'PERTURBATION',
  OTHER = 'OTHER',
}

export const ocurrenceSchema = schema(
  {
    latitude: types.number({ required: true }),
    longitude: types.number({ required: true }),
    state: types.string({ required: true }),
    city: types.string({ required: true }),
    status: types.enum(Object.values(OcurrenceStatusEnum), { required: true }),
    type: types.enum(Object.values(OcurrenceTypeEnum), { required: true }),
    fullAddress: types.string({ required: true }),
    description: types.string(),
    cancellationReason: types.string(),
    user: types.object(
      {
        _id: types.objectId({ required: true }),
        cpf: types.string({ required: true }),
        name: types.string({ required: true }),
        email: types.string({ required: true }),
        faceAndDocumentPhotoPath: types.string(),
      },
      { required: true },
    ),
    callCenter: types.object(
      {
        _id: types.objectId({ required: true }),
        name: types.string({ required: true }),
        city: types.string({ required: true }),
        state: types.string({ required: true }),
      },
      { required: false },
    ),
  },
  { timestamps: true },
)

export type OcurrenceDocument = typeof ocurrenceSchema[0]
