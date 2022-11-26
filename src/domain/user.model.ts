import { schema, types } from 'papr'

export const userSchema = schema(
  {
    cpf: types.string({ required: true }),
    name: types.string({ required: true }),
    password: types.string({ required: true }),
    email: types.string({ required: true }),
    isValidated: types.boolean({ required: true }),
    faceAndDocumentPhotoPath: types.string({ required: true }),
  },
  { timestamps: true },
)

export type UserDocument = typeof userSchema[0]
