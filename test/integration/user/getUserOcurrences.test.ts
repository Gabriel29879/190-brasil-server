import { createOcurrence, createUserAndLogin } from '@testUtils/functions'
import { clearDB, closeConnections, setupTestGlobals } from '@testUtils/index'
import { ObjectId } from 'mongodb'

describe('Testing getUserOcurrences', () => {
  beforeAll(async () => {
    await setupTestGlobals('getUserOcurrencesDB')
    // eslint-disable-next-line functional/immutable-data
    global.__TEST_JWT__ = await createUserAndLogin()
  })

  beforeEach(async () => {
    await clearDB()
  })

  afterAll(async () => {
    await closeConnections()
  })

  it('Should get an ocurrence', async () => {
    await createOcurrence({})

    const res = await global.__TEST_APP__.inject({
      url: '/user/ocurrence?skip=0',
      method: 'GET',
      headers: {
        authorization: `Bearer ${global.__TEST_JWT__}`,
      },
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
    await createOcurrence({})
    await createOcurrence({ _id: new ObjectId('123456789123456789123422') })

    const res = await global.__TEST_APP__.inject({
      url: '/user/ocurrence?skip=1',
      method: 'GET',
      headers: {
        authorization: `Bearer ${global.__TEST_JWT__}`,
      },
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
    await createOcurrence({})
    await createOcurrence({ _id: new ObjectId('123456789123456789123422') })

    const res = await global.__TEST_APP__.inject({
      url: '/user/ocurrence?skip=0&_id=123456789123456789123422',
      method: 'GET',
      headers: {
        authorization: `Bearer ${global.__TEST_JWT__}`,
      },
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
})
