import { generateRandomBytes, SHA } from '../index'

const text = 'password'
let sha: SHA

beforeAll(() => {
  sha = new SHA()
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
