import { CallCenterDocument } from '@domain/callCenter.model'
import { OcurrenceDocument, OcurrenceStatusEnum, OcurrenceTypeEnum } from '@domain/ocurrence.model'
import { UserDocument } from '@domain/user.model'
import { Document, Filter, ObjectId } from 'mongodb'

export const createUser = ({
  _id = '123456789123456789123456',
  name = 'Jonh Doe',
  cpf = '06659636021',
  email = 'email@email.com',
  isValidated = true,
}) =>
  global.__TEST_USER_COLLECTION__.insertOne({
    _id: new ObjectId(_id),
    name,
    cpf,
    email,
    isValidated,
    password: '$2b$10$1fP.wfkbhQ6tiZSst3QPCukK8gOMlJ5Jm7fasVT7MPf8KceXY5xEm', // 12345
    createdAt: new Date('2022-10-05T06:04:45.963Z'),
    updatedAt: new Date('2022-10-05T06:04:45.963Z'),
  })

export const createOcurrence = ({
  _id = new ObjectId('123456789123456789123457'),
  city = 'Test City',
  fullAddress = 'Test address',
  state = 'SP',
  status = OcurrenceStatusEnum.PENDING,
  type = OcurrenceTypeEnum.EMERGENCY,
  latitude = -25.471028,
  longitude = -49.225192,
  description = 'Test description',
  user = {
    _id: new ObjectId('123456789123456789123456'),
    name: 'Jonh Doe',
    cpf: '06659636021',
    email: 'email@email.com',
  },
  callCenter,
}: Partial<OcurrenceDocument>) =>
  global.__TEST_OCURRENCE_COLLECTION__.insertOne({
    _id,
    city,
    status,
    fullAddress,
    state,
    type,
    latitude,
    longitude,
    description,
    user,
    callCenter,
    createdAt: new Date('2022-10-05T06:04:45.963Z'),
    updatedAt: new Date('2022-10-05T06:04:45.963Z'),
  })

export const createCallCenter = ({
  _id = '635b344fb86ea038c9334eab',
  name = 'Test call center',
  city = 'Test city',
  state = 'SP',
}) =>
  global.__TEST_CALL_CENTER_COLLECTION.insertOne({
    _id: new ObjectId(_id),
    name,
    city,
    state,
    apiKey: '$2b$10$RZ1jk6/N1OUQoL/7aBpZ3OWOqK1XiBUaVPBEukJB2bhKelWMS62.e', // 635b344fb86ea038c9334eab_b4245d49-b8f8-4805-b5fd-98e097fb315a
    createdAt: new Date('2022-10-05T06:04:45.963Z'),
    updatedAt: new Date('2022-10-05T06:04:45.963Z'),
  })

export const getAllUsers = (filter: Filter<UserDocument> = {}, projection: Document = {}) =>
  global.__TEST_USER_COLLECTION__.find(filter, { projection })
export const getAllOccurrences = () => global.__TEST_OCURRENCE_COLLECTION__.find({})
export const getAllCallCenters = (filter: Filter<CallCenterDocument> = {}, projection: Document = {}) =>
  global.__TEST_CALL_CENTER_COLLECTION.find(filter, { projection })

export const createUserAndLogin = async () => {
  await createUser({})
  const res = await global.__TEST_APP__.inject({
    url: '/user/login',
    method: 'POST',
    payload: {
      cpf: '06659636021',
      password: '12345',
    },
  })
  return JSON.parse(res.payload).token
}
