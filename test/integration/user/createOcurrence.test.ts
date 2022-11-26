import { createUser, createUserAndLogin } from '@testUtils/functions'
import { clearDB, closeConnections, setupTestGlobals } from '@testUtils/index'

describe('Testing createOcurrence', () => {
  beforeAll(async () => {
    await setupTestGlobals('createOcurrenceDB')
    // eslint-disable-next-line functional/immutable-data
    global.__TEST_JWT__ = await createUserAndLogin()
  })

  beforeEach(async () => {
    await clearDB()
  })

  afterAll(async () => {
    await closeConnections()
  })

  it('Should create an ocurrence', async () => {
    await createUser({})

    const res = await global.__TEST_APP__.inject({
      url: '/user/ocurrence',
      method: 'POST',
      payload: {
        latitude: -25.471028,
        longitude: -49.225192,
        type: 'EMERGENCY',
        description: 'Acidente de carro grave, uma pessoa esta gravemente ferida',
      },
      headers: {
        authorization: `Bearer ${global.__TEST_JWT__}`,
      },
    })

    expect(JSON.parse(res.payload)).toHaveProperty('city', '(DEV) São Paulo')
    expect(JSON.parse(res.payload)).toHaveProperty(
      'description',
      'Acidente de carro grave, uma pessoa esta gravemente ferida',
    )
    expect(JSON.parse(res.payload)).toHaveProperty(
      'fullAddress',
      '(DEV) Rua Quarenta e Sete, Jardim São Paulo(Zona Leste), São Paulo, SP - 08465312',
    )
    expect(JSON.parse(res.payload)).toHaveProperty('_id')
    expect(JSON.parse(res.payload)).toHaveProperty('latitude', -25.471028)
    expect(JSON.parse(res.payload)).toHaveProperty('longitude', -49.225192)
    expect(JSON.parse(res.payload)).toHaveProperty('state', 'SP')
    expect(JSON.parse(res.payload)).toHaveProperty('city', '(DEV) São Paulo')
    expect(JSON.parse(res.payload)).toHaveProperty('status', 'PENDING')
    expect(JSON.parse(res.payload)).toHaveProperty('type', 'EMERGENCY')
    expect(JSON.parse(res.payload).user).toHaveProperty('_id')
    expect(JSON.parse(res.payload).user).toHaveProperty('cpf', '06659636021')
    expect(JSON.parse(res.payload).user).toHaveProperty('email', 'email@email.com')
    expect(JSON.parse(res.payload).user).toHaveProperty('name', 'Jonh Doe')
    expect(JSON.parse(res.payload)).not.toHaveProperty('password')
  })

  it('Should not create an ocurrence if the user is not validated', async () => {
    await createUser({ isValidated: false })

    const res = await global.__TEST_APP__.inject({
      url: '/user/ocurrence',
      method: 'POST',
      payload: {
        latitude: -25.471028,
        longitude: -49.225192,
        type: 'EMERGENCY',
        description: 'Acidente de carro grave, uma pessoa esta gravemente ferida',
      },
      headers: {
        authorization: `Bearer ${global.__TEST_JWT__}`,
      },
    })

    expect(res.statusCode).toBe(401)
    expect(res.payload).toBe('User does not have permission to create an ocurrence')
  })
})
