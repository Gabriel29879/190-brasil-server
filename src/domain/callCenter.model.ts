import { schema, types } from 'papr'

export const callCenterSchema = schema(
  {
    name: types.string({ required: true }),
    city: types.string({ required: true }),
    state: types.string({ required: true }),
    apiKey: types.string({ required: false }),
  },
  { timestamps: true },
)

export type CallCenterDocument = typeof callCenterSchema[0]
