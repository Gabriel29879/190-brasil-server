import { getAllCallCenters } from '@testUtils/functions'
import { clearDB, closeConnections, setupTestGlobals } from '@testUtils/index'

describe('Testing createCallCenter', () => {
  beforeAll(async () => {
    await setupTestGlobals('createCallCenterDB')
  })

  beforeEach(async () => {
    await clearDB()
  })

  afterAll(async () => {
    await closeConnections()
  })

  it('Should create a call center', async () => {
    await global.__TEST_APP__.inject({
      url: '/admin/call-center',
      method: 'POST',
      payload: {
        name: 'Test call center name',
        city: 'Test call center city',
        state: 'SP',
        masterApiKey: 'test-master-api-key',
      },
    })

    const [callCenter] = await getAllCallCenters(
      { apiKey: { $exists: true } },
      { createdAt: 0, updatedAt: 0, _id: 0, apiKey: 0 },
    )

    expect(callCenter).toEqual({
      city: 'Test call center city',
      name: 'Test call center name',
      state: 'SP',
    })
  })

  it('Should return an error if an invalid masterApiKey is provided', async () => {
    const res = await global.__TEST_APP__.inject({
      url: '/admin/call-center',
      method: 'POST',
      payload: {
        name: 'Test call center name',
        city: 'Test call center city',
        state: 'SP',
        masterApiKey: 'test-master-ap',
      },
    })

    expect(res.statusCode).toBe(401)
    expect(res.payload).toBe('Unauthorized')
  })
})
