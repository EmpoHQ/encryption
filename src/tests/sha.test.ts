import { generateRandomBytes, SHA } from '../index'

const text = 'password'
let sha: SHA

beforeAll(() => {
  const pepper = generateRandomBytes({ type: 'salt', encoding: 'base64' }) as string
  sha = new SHA(pepper)
})

describe('SHA', () => {
  test('encrypt()', () => {
    const encrypted = sha.encrypt(text)
    expect(encrypted.length).toBe(44)
  })

  test('allow rainbow', () => {
    const e1 = sha.encrypt(text)
    const e2 = sha.encrypt(text)

    const isSame = e1 === e2

    expect(isSame).toBe(true)
  })
})
