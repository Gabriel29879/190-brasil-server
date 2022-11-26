import { createUser } from '@testUtils/functions'
import { clearDB, closeConnections, setupTestGlobals } from '@testUtils/index'

describe('Testing getUsers', () => {
  beforeAll(async () => {
    await setupTestGlobals('getUsersDB')
  })

  beforeEach(async () => {
    await clearDB()
  })

  afterAll(async () => {
    await closeConnections()
  })

  it('Should get a user', async () => {
    await createUser({})

    const res = await global.__TEST_APP__.inject({
      url: '/admin/user?skip=0&masterApiKey=test-master-api-key',
    })

    expect(JSON.parse(res.payload)).toEqual([
      {
        _id: '123456789123456789123456',
        cpf: '06659636021',
        createdAt: '2022-10-05T06:04:45.963Z',
        updatedAt: '2022-10-05T06:04:45.963Z',
        email: 'email@email.com',
        isValidated: true,
        name: 'Jonh Doe',
      },
    ])
  })

  it('Should skip a user', async () => {
    await createUser({})
    await createUser({ _id: '635b344fb86ea038c9334e40' })

    const res = await global.__TEST_APP__.inject({
      url: '/admin/user?skip=1&masterApiKey=test-master-api-key',
    })

    expect(JSON.parse(res.payload)).toHaveLength(1)
    expect(JSON.parse(res.payload)).toEqual([
      {
        _id: '635b344fb86ea038c9334e40',
        cpf: '06659636021',
        createdAt: '2022-10-05T06:04:45.963Z',
        updatedAt: '2022-10-05T06:04:45.963Z',
        email: 'email@email.com',
        isValidated: true,
        name: 'Jonh Doe',
      },
    ])
  })

  it('Should get a user by id', async () => {
    await createUser({})
    await createUser({ _id: '635b344fb86ea038c9334e40' })

    const res = await global.__TEST_APP__.inject({
      url: '/admin/user?skip=0&masterApiKey=test-master-api-key&_id=635b344fb86ea038c9334e40',
    })

    expect(JSON.parse(res.payload)).toHaveLength(1)
    expect(JSON.parse(res.payload)).toEqual([
      {
        _id: '635b344fb86ea038c9334e40',
        cpf: '06659636021',
        createdAt: '2022-10-05T06:04:45.963Z',
        updatedAt: '2022-10-05T06:04:45.963Z',
        email: 'email@email.com',
        isValidated: true,
        name: 'Jonh Doe',
      },
    ])
  })

  it('Should return an error if an invalid masterApiKey is provided', async () => {
    const res = await global.__TEST_APP__.inject({
      url: '/admin/user?skip=0&masterApiKey=123123',
    })

    expect(res.statusCode).toBe(401)
    expect(res.payload).toBe('Unauthorized')
  })
})
