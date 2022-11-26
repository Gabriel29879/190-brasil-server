import { OcurrenceStatusEnum } from '@domain/ocurrence.model'
import { createCallCenter, createOcurrence, getAllOccurrences } from '@testUtils/functions'
import { clearDB, closeConnections, setupTestGlobals } from '@testUtils/index'
import { ObjectId } from 'mongodb'

describe('Testing attendOcurrence', () => {
  beforeAll(async () => {
    await setupTestGlobals('attendOcurrenceDB')
  })

  beforeEach(async () => {
    await clearDB()
  })

  afterAll(async () => {
    await closeConnections()
  })

  it('Should attend an ocurrence', async () => {
    await createCallCenter({})
    await createOcurrence({})

    await global.__TEST_APP__.inject({
      url: '/call-center/attend-ocurrence',
      method: 'PUT',
      payload: {
        _id: '123456789123456789123457',
        callCenterApiKey: '635b344fb86ea038c9334eab_b4245d49-b8f8-4805-b5fd-98e097fb315a',
      },
    })

    const [ocurrence] = await getAllOccurrences()

    expect(ocurrence.status).toBe(OcurrenceStatusEnum.IN_ATTENDANCE)
    expect(ocurrence.callCenter).toEqual({
      _id: new ObjectId('635b344fb86ea038c9334eab'),
      name: 'Test call center',
      city: 'Test city',
      state: 'SP',
    })
  })

  it('Should return an error if no ocurrence is found', async () => {
    await createCallCenter({})

    const res = await global.__TEST_APP__.inject({
      url: '/call-center/attend-ocurrence',
      method: 'PUT',
      payload: {
        _id: '123456789123456789123457',
        callCenterApiKey: '635b344fb86ea038c9334eab_b4245d49-b8f8-4805-b5fd-98e097fb315a',
      },
    })

    expect(res.statusCode).toBe(404)
    expect(res.payload).toBe('Ocurrence not found')
  })

  it('Should return an error if ocurrence and callcenter are from different states', async () => {
    await createCallCenter({})
    await createOcurrence({ state: 'PR' })

    const res = await global.__TEST_APP__.inject({
      url: '/call-center/attend-ocurrence',
      method: 'PUT',
      payload: {
        _id: '123456789123456789123457',
        callCenterApiKey: '635b344fb86ea038c9334eab_b4245d49-b8f8-4805-b5fd-98e097fb315a',
      },
    })

    expect(res.statusCode).toBe(401)
    expect(res.payload).toBe('Not allowed to attend ocurrence from another state')
  })

  it('Should return an error if ocurrence is not pending', async () => {
    await createCallCenter({})
    await createOcurrence({ status: OcurrenceStatusEnum.IN_ATTENDANCE })

    const res = await global.__TEST_APP__.inject({
      url: '/call-center/attend-ocurrence',
      method: 'PUT',
      payload: {
        _id: '123456789123456789123457',
        callCenterApiKey: '635b344fb86ea038c9334eab_b4245d49-b8f8-4805-b5fd-98e097fb315a',
      },
    })

    expect(res.statusCode).toBe(401)
    expect(res.payload).toBe('Not allowed to attend ocurrence that is not pending')
  })
})
