import { createCallCenter } from '@testUtils/functions'
import { clearDB, closeConnections, setupTestGlobals } from '@testUtils/index'

describe('Testing getCallCenters', () => {
  beforeAll(async () => {
    await setupTestGlobals('getCallCentersDB')
  })

  beforeEach(async () => {
    await clearDB()
  })

  afterAll(async () => {
    await closeConnections()
  })

  it('Should get a call center', async () => {
    await createCallCenter({})

    const res = await global.__TEST_APP__.inject({
      url: '/admin/call-center?skip=0&masterApiKey=test-master-api-key',
    })

    expect(JSON.parse(res.payload)).toEqual([
      {
        name: 'Test call center',
        city: 'Test city',
        state: 'SP',
        createdAt: '2022-10-05T06:04:45.963Z',
        updatedAt: '2022-10-05T06:04:45.963Z',
        _id: '635b344fb86ea038c9334eab',
      },
    ])
  })

  it('Should skip a call center', async () => {
    await createCallCenter({})
    await createCallCenter({ _id: '635b344fb86ea038c9334e40' })

    const res = await global.__TEST_APP__.inject({
      url: '/admin/call-center?skip=1&masterApiKey=test-master-api-key',
    })

    expect(JSON.parse(res.payload)).toHaveLength(1)
    expect(JSON.parse(res.payload)).toEqual([
      {
        name: 'Test call center',
        city: 'Test city',
        state: 'SP',
        createdAt: '2022-10-05T06:04:45.963Z',
        updatedAt: '2022-10-05T06:04:45.963Z',
        _id: '635b344fb86ea038c9334e40',
      },
    ])
  })

  it('Should get a call center by id', async () => {
    await createCallCenter({})
    await createCallCenter({ _id: '635b344fb86ea038c9334e40' })

    const res = await global.__TEST_APP__.inject({
      url: '/admin/call-center?skip=0&masterApiKey=test-master-api-key&_id=635b344fb86ea038c9334e40',
    })

    expect(JSON.parse(res.payload)).toHaveLength(1)
    expect(JSON.parse(res.payload)).toEqual([
      {
        name: 'Test call center',
        city: 'Test city',
        state: 'SP',
        createdAt: '2022-10-05T06:04:45.963Z',
        updatedAt: '2022-10-05T06:04:45.963Z',
        _id: '635b344fb86ea038c9334e40',
      },
    ])
  })

  it('Should return an error if an invalid masterApiKey is provided', async () => {
    const res = await global.__TEST_APP__.inject({
      url: '/admin/call-center?skip=0&masterApiKey=123123',
    })

    expect(res.statusCode).toBe(401)
    expect(res.payload).toBe('Unauthorized')
  })
})
