import { createUser } from '@testUtils/functions'
import { clearDB, closeConnections, setupTestGlobals } from '@testUtils/index'

describe('Testing blockUser', () => {
  beforeAll(async () => {
    await setupTestGlobals('blockUserDB')
  })

  beforeEach(async () => {
    await clearDB()
  })

  afterAll(async () => {
    await closeConnections()
  })

  it('Should block a user', async () => {
    await createUser({})

    const res = await global.__TEST_APP__.inject({
      url: '/admin/block-user',
      method: 'put',
      payload: {
        _id: '123456789123456789123456',
        masterApiKey: 'test-master-api-key',
      },
    })

    expect(res.payload).toEqual('User blocked successfully')
  })

  it('Should return an error if no suer is found', async () => {
    await createUser({})

    const res = await global.__TEST_APP__.inject({
      url: '/admin/block-user',
      method: 'put',
      payload: {
        _id: '123456789123456789123454',
        masterApiKey: 'test-master-api-key',
      },
    })

    expect(res.statusCode).toBe(404)
    expect(res.payload).toEqual('No user found')
  })

  it('Should return an error if an invalid masterApiKey is provided', async () => {
    const res = await global.__TEST_APP__.inject({
      url: '/admin/block-user',
      method: 'put',
      payload: {
        _id: '123456789123456789123456',
        masterApiKey: 'test-master-ap',
      },
    })

    expect(res.statusCode).toBe(401)
    expect(res.payload).toBe('Unauthorized')
  })
})
