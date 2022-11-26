import { OcurrenceStatusEnum } from '@domain/ocurrence.model'
import { createOcurrence, createUser, createUserAndLogin, getAllOccurrences } from '@testUtils/functions'
import { clearDB, closeConnections, setupTestGlobals } from '@testUtils/index'
import { ObjectId } from 'mongodb'

describe('Testing cancelOcurrence', () => {
  beforeAll(async () => {
    await setupTestGlobals('cancelOcurrenceDB')
    // eslint-disable-next-line functional/immutable-data
    global.__TEST_JWT__ = await createUserAndLogin()
  })

  beforeEach(async () => {
    await clearDB()
  })

  afterAll(async () => {
    await closeConnections()
  })

  it('Should cancel an ocurrence', async () => {
    await createUser({})
    await createOcurrence({})

    await global.__TEST_APP__.inject({
      url: '/user/ocurrence/cancel',
      method: 'PUT',
      payload: {
        _id: '123456789123456789123457',
        cancellationReason: 'Test reason',
      },
      headers: {
        authorization: `Bearer ${global.__TEST_JWT__}`,
      },
    })

    const [ocurrence] = await getAllOccurrences()

    expect(ocurrence._id.toHexString()).toBe('123456789123456789123457')
    expect(ocurrence.status).toBe('CANCELLED')
  })

  it('Should not cancel a finished ocurrence', async () => {
    await createUser({})
    await createOcurrence({ status: OcurrenceStatusEnum.FINISHED })

    const res = await global.__TEST_APP__.inject({
      url: '/user/ocurrence/cancel',
      method: 'PUT',
      payload: {
        _id: '123456789123456789123457',
        cancellationReason: 'Test reason',
      },
      headers: {
        authorization: `Bearer ${global.__TEST_JWT__}`,
      },
    })

    expect(res.statusCode).toBe(400)
    expect(res.payload).toBe('Cannot cancel ocurrence with status finished')
  })

  it('Should not cancel an already cancelled ocurrence', async () => {
    await createUser({})
    await createOcurrence({ status: OcurrenceStatusEnum.CANCELLED })

    const res = await global.__TEST_APP__.inject({
      url: '/user/ocurrence/cancel',
      method: 'PUT',
      payload: {
        _id: '123456789123456789123457',
        cancellationReason: 'Test reason',
      },
      headers: {
        authorization: `Bearer ${global.__TEST_JWT__}`,
      },
    })

    expect(res.statusCode).toBe(400)
    expect(res.payload).toBe('Cannot cancel ocurrence with status cancelled')
  })

  it('Should not cancel an occurence from another user', async () => {
    await createUser({})
    await createOcurrence({
      user: {
        _id: new ObjectId('123456789123456789123458'),
        name: 'Jonh Doe',
        cpf: '06659636021',
        email: 'email@email.com',
      },
    })

    const res = await global.__TEST_APP__.inject({
      url: '/user/ocurrence/cancel',
      method: 'PUT',
      payload: {
        _id: '123456789123456789123457',
        cancellationReason: 'Test reason',
      },
      headers: {
        authorization: `Bearer ${global.__TEST_JWT__}`,
      },
    })

    expect(res.statusCode).toBe(401)
    expect(res.payload).toBe('Not authorized to execute this operation')
  })

  it('Should return an error if no ocurrence is found', async () => {
    await createUser({})
    await createOcurrence({})

    const res = await global.__TEST_APP__.inject({
      url: '/user/ocurrence/cancel',
      method: 'PUT',
      payload: {
        _id: '123456789123456789123459',
        cancellationReason: 'Test reason',
      },
      headers: {
        authorization: `Bearer ${global.__TEST_JWT__}`,
      },
    })

    expect(res.statusCode).toBe(404)
    expect(res.payload).toBe('Ocurrence not found')
  })
})
