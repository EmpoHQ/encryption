import { generateRandomBytes, SHA } from '../index'

const text = 'password'
let sha: SHA

beforeAll(() => {
  sha = new SHA()
})

describe('SHA', () => {
  test('encrpyt()', () => {
    const encrpyted = sha.encrypt(text)
    expect(encrpyted.length).toBe(44)
  })

  test('allow rainbow', () => {
    const e1 = sha.encrypt(text)
    const e2 = sha.encrypt(text)

    const isSame = e1 === e2

    expect(isSame).toBe(true)
  })
})
