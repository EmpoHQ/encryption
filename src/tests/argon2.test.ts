import { generateRandomBytes, Argon2 } from '../index'

const text = 'password'

let argon2: Argon2
let argon2_encrypted: string

beforeAll(() => {
  const pepper = generateRandomBytes({ type: 'salt', encoding: 'base64' }) as string
  const salt = generateRandomBytes({ type: 'salt', encoding: 'base64' }) as string
  argon2 = new Argon2(pepper, salt)
})

describe('Argon2', () => {
  test('encrypt()', async () => {
    argon2_encrypted = await argon2.encrypt(text)
    expect(argon2_encrypted).toMatch(/^\$argon2*/)
  })

  test('match()', async () => {
    const matched = await argon2.match(argon2_encrypted, text)
    expect(matched).toBe(true)
  })
})
