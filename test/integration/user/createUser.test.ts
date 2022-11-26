import { clearDB, closeConnections, setupTestGlobals } from '@testUtils/index'

describe('Testing createUser', () => {
  beforeAll(async () => {
    await setupTestGlobals('createUserDB')
  })

  beforeEach(async () => {
    await clearDB()
  })

  afterAll(async () => {
    await closeConnections()
  })

  it('Should create a user', async () => {
    const res = await global.__TEST_APP__.inject({
      url: '/user',
      method: 'POST',
      payload: {
        cpf: '06659636021',
        name: 'Jonh Doe',
        password: '12345',
        email: 'email@email.com',
        faceAndDocumentPhotoData: {
          uri: 'asdijkaiopwjkdpawkd',
          fileExtension: 'jpg',
        },
      },
    })

    expect(JSON.parse(res.payload)).toHaveProperty('cpf', '06659636021')
    expect(JSON.parse(res.payload)).toHaveProperty('name', 'Jonh Doe')
    expect(JSON.parse(res.payload)).toHaveProperty('email', 'email@email.com')
    expect(JSON.parse(res.payload)).toHaveProperty('isValidated', false)
    expect(JSON.parse(res.payload)).toHaveProperty('faceAndDocumentPhotoPath')
    expect(JSON.parse(res.payload)).toHaveProperty('createdAt')
    expect(JSON.parse(res.payload)).toHaveProperty('updatedAt')
    expect(JSON.parse(res.payload)).not.toHaveProperty('password')
  })
})
