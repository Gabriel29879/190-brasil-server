import { createUser } from '@testUtils/functions'
import { clearDB, closeConnections, setupTestGlobals } from '@testUtils/index'

describe('Testing loginUser', () => {
  beforeAll(async () => {
    await setupTestGlobals('loginUserDB')
  })

  beforeEach(async () => {
    await clearDB()
  })

  afterAll(async () => {
    await closeConnections()
  })

  it('Should login a user', async () => {
    await createUser({})

    const res = await global.__TEST_APP__.inject({
      url: '/user/login',
      method: 'POST',
      payload: {
        cpf: '06659636021',
        password: '12345',
      },
    })

    expect(JSON.parse(res.payload)).toHaveProperty('cpf', '06659636021')
    expect(JSON.parse(res.payload)).toHaveProperty('name', 'Jonh Doe')
    expect(JSON.parse(res.payload)).toHaveProperty('email', 'email@email.com')
    expect(JSON.parse(res.payload)).toHaveProperty('isValidated')
    expect(JSON.parse(res.payload)).toHaveProperty('token')
    expect(JSON.parse(res.payload)).not.toHaveProperty('password')
  })

  it('Should return an error if credentials dont match any user', async () => {
    const res = await global.__TEST_APP__.inject({
      url: '/user/login',
      method: 'POST',
      payload: {
        cpf: '06659636021',
        password: '12345',
      },
    })

    expect(res.statusCode).toBe(404)
    expect(res.body).toBe('Credentials dont match any user')
  })
})
