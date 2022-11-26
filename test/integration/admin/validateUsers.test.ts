import { createUser, getAllUsers } from '@testUtils/functions'
import { clearDB, closeConnections, setupTestGlobals } from '@testUtils/index'

describe('Testing validateUsers', () => {
  beforeAll(async () => {
    await setupTestGlobals('validateUsersDB')
  })

  beforeEach(async () => {
    await clearDB()
  })

  afterAll(async () => {
    await closeConnections()
  })

  it('Should validate users', async () => {
    await createUser({ isValidated: false })
    await createUser({ _id: '635b344fb86ea038c9334e40', isValidated: false })

    await global.__TEST_APP__.inject({
      url: '/admin/validate-users',
      method: 'PUT',
      payload: {
        masterApiKey: 'test-master-api-key',
        userIds: ['123456789123456789123456', '635b344fb86ea038c9334e40'],
      },
    })

    const users = await getAllUsers({ isValidated: true })

    expect(users).toHaveLength(2)
  })

  it('Should return an error if an invalid masterApiKey is provided', async () => {
    await createUser({})

    const res = await global.__TEST_APP__.inject({
      url: '/admin/validate-users',
      method: 'PUT',
      payload: {
        masterApiKey: '123123',
        userIds: ['123456789123456789123456'],
      },
    })

    expect(res.statusCode).toBe(401)
    expect(res.payload).toBe('Unauthorized')
  })
})
