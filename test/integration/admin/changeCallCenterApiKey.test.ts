import { createCallCenter, getAllCallCenters } from '@testUtils/functions'
import { clearDB, closeConnections, setupTestGlobals } from '@testUtils/index'

describe('Testing changeCallCenterApiKey', () => {
  beforeAll(async () => {
    await setupTestGlobals('changeCallCenterApiKeyDB')
  })

  beforeEach(async () => {
    await clearDB()
  })

  afterAll(async () => {
    await closeConnections()
  })

  it('Should change a call center api key', async () => {
    await createCallCenter({})

    const res = await global.__TEST_APP__.inject({
      url: '/admin/change-call-center-api-key',
      method: 'PUT',
      payload: {
        _id: '635b344fb86ea038c9334eab',
        masterApiKey: 'test-master-api-key',
      },
    })

    const [callCenter] = await getAllCallCenters({}, { _id: 0, apiKey: 1 })

    expect(callCenter.apiKey).not.toBe('$2b$10$RZ1jk6/N1OUQoL/7aBpZ3OWOqK1XiBUaVPBEukJB2bhKelWMS62.e')
    expect(JSON.parse(res.payload)).toHaveProperty('newApiKey')
    expect(JSON.parse(res.payload).name).toBe('Test call center')
    expect(JSON.parse(res.payload).city).toBe('Test city')
    expect(JSON.parse(res.payload).state).toBe('SP')
  })

  it('Should return an error if no call center is found', async () => {
    const res = await global.__TEST_APP__.inject({
      url: '/admin/change-call-center-api-key',
      method: 'PUT',
      payload: {
        _id: '635b344fb86ea038c9334e22',
        masterApiKey: 'test-master-api-key',
      },
    })

    expect(res.statusCode).toBe(404)
    expect(res.payload).toBe('No call center found')
  })

  it('Should return an error if an invalid masterApiKey is provided', async () => {
    const res = await global.__TEST_APP__.inject({
      url: '/admin/change-call-center-api-key',
      method: 'PUT',
      payload: {
        _id: '635b344fb86ea038c9334eab',
        masterApiKey: 'test-master-ap',
      },
    })

    expect(res.statusCode).toBe(401)
    expect(res.payload).toBe('Unauthorized')
  })
})
