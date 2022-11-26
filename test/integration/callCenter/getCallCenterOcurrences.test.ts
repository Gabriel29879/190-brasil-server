import { OcurrenceStatusEnum } from '@domain/ocurrence.model'
import { createCallCenter, createOcurrence } from '@testUtils/functions'
import { clearDB, closeConnections, setupTestGlobals } from '@testUtils/index'
import { ObjectId } from 'mongodb'

describe('Testing getCallCenterOcurrences', () => {
  beforeAll(async () => {
    await setupTestGlobals('getCallCenterOcurrencesDB')
  })

  beforeEach(async () => {
    await clearDB()
  })

  afterAll(async () => {
    await closeConnections()
  })

  it('Should get an ocurrence', async () => {
    await createCallCenter({})
    await createOcurrence({})

    const res = await global.__TEST_APP__.inject({
      url: '/call-center/ocurrence?skip=0&callCenterApiKey=635b344fb86ea038c9334eab_b4245d49-b8f8-4805-b5fd-98e097fb315a',
    })

    expect(JSON.parse(res.payload)).toHaveLength(1)
    expect(JSON.parse(res.payload)).toEqual([
      {
        _id: '123456789123456789123457',
        createdAt: '2022-10-05T06:04:45.963Z',
        updatedAt: '2022-10-05T06:04:45.963Z',
        city: 'Test City',
        status: 'PENDING',
        fullAddress: 'Test address',
        state: 'SP',
        type: 'EMERGENCY',
        latitude: -25.471028,
        longitude: -49.225192,
        description: 'Test description',
        user: {
          _id: '123456789123456789123456',
          name: 'Jonh Doe',
          cpf: '06659636021',
          email: 'email@email.com',
        },
      },
    ])
  })

  it('Should skip an ocurrence', async () => {
    await createCallCenter({})
    await createOcurrence({})
    await createOcurrence({ _id: new ObjectId('123456789123456789123422') })

    const res = await global.__TEST_APP__.inject({
      url: '/call-center/ocurrence?skip=1&callCenterApiKey=635b344fb86ea038c9334eab_b4245d49-b8f8-4805-b5fd-98e097fb315a',
    })

    expect(JSON.parse(res.payload)).toHaveLength(1)
    expect(JSON.parse(res.payload)).toEqual([
      {
        _id: '123456789123456789123422',
        createdAt: '2022-10-05T06:04:45.963Z',
        updatedAt: '2022-10-05T06:04:45.963Z',
        city: 'Test City',
        status: 'PENDING',
        fullAddress: 'Test address',
        state: 'SP',
        type: 'EMERGENCY',
        latitude: -25.471028,
        longitude: -49.225192,
        description: 'Test description',
        user: {
          _id: '123456789123456789123456',
          name: 'Jonh Doe',
          cpf: '06659636021',
          email: 'email@email.com',
        },
      },
    ])
  })

  it('Should get ocurrence by id', async () => {
    await createCallCenter({})
    await createOcurrence({})
    await createOcurrence({ _id: new ObjectId('123456789123456789123422') })

    const res = await global.__TEST_APP__.inject({
      url: '/call-center/ocurrence?skip=0&callCenterApiKey=635b344fb86ea038c9334eab_b4245d49-b8f8-4805-b5fd-98e097fb315a&_id=123456789123456789123422',
    })

    expect(JSON.parse(res.payload)).toHaveLength(1)
    expect(JSON.parse(res.payload)).toEqual([
      {
        _id: '123456789123456789123422',
        createdAt: '2022-10-05T06:04:45.963Z',
        updatedAt: '2022-10-05T06:04:45.963Z',
        city: 'Test City',
        status: 'PENDING',
        fullAddress: 'Test address',
        state: 'SP',
        type: 'EMERGENCY',
        latitude: -25.471028,
        longitude: -49.225192,
        description: 'Test description',
        user: {
          _id: '123456789123456789123456',
          name: 'Jonh Doe',
          cpf: '06659636021',
          email: 'email@email.com',
        },
      },
    ])
  })

  it('Should get ocurrence by userId', async () => {
    await createCallCenter({})
    await createOcurrence({})
    await createOcurrence({
      _id: new ObjectId('123456789123456789123499'),
      user: {
        _id: new ObjectId('123456789123456789123477'),
        name: 'Amanda Mei',
        cpf: '06659636999',
        email: 'email2@email.com',
      },
    })

    const res = await global.__TEST_APP__.inject({
      url: '/call-center/ocurrence?skip=0&callCenterApiKey=635b344fb86ea038c9334eab_b4245d49-b8f8-4805-b5fd-98e097fb315a&userId=123456789123456789123477',
    })

    expect(JSON.parse(res.payload)).toHaveLength(1)
    expect(JSON.parse(res.payload)).toEqual([
      {
        _id: '123456789123456789123499',
        createdAt: '2022-10-05T06:04:45.963Z',
        updatedAt: '2022-10-05T06:04:45.963Z',
        city: 'Test City',
        status: 'PENDING',
        fullAddress: 'Test address',
        state: 'SP',
        type: 'EMERGENCY',
        latitude: -25.471028,
        longitude: -49.225192,
        description: 'Test description',
        user: {
          _id: '123456789123456789123477',
          name: 'Amanda Mei',
          cpf: '06659636999',
          email: 'email2@email.com',
        },
      },
    ])
  })

  it('Should get ocurrence by status', async () => {
    await createCallCenter({})
    await createOcurrence({})
    await createOcurrence({ _id: new ObjectId('123456789123456789123422'), status: OcurrenceStatusEnum.IN_ATTENDANCE })

    const res = await global.__TEST_APP__.inject({
      url: `/call-center/ocurrence?skip=0&callCenterApiKey=635b344fb86ea038c9334eab_b4245d49-b8f8-4805-b5fd-98e097fb315a&status=${OcurrenceStatusEnum.IN_ATTENDANCE}`,
    })

    expect(JSON.parse(res.payload)).toHaveLength(1)
    expect(JSON.parse(res.payload)).toEqual([
      {
        _id: '123456789123456789123422',
        createdAt: '2022-10-05T06:04:45.963Z',
        updatedAt: '2022-10-05T06:04:45.963Z',
        city: 'Test City',
        status: 'IN_ATTENDANCE',
        fullAddress: 'Test address',
        state: 'SP',
        type: 'EMERGENCY',
        latitude: -25.471028,
        longitude: -49.225192,
        description: 'Test description',
        user: {
          _id: '123456789123456789123456',
          name: 'Jonh Doe',
          cpf: '06659636021',
          email: 'email@email.com',
        },
      },
    ])
  })
})
