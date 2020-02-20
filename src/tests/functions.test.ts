import { generateRandomBytes } from '../index'

test('generateRandomBytes length check', () => {
  const buffer_iv = generateRandomBytes({ type: 'iv' })
  const buffer_salt = generateRandomBytes({ type: 'salt' })

  const buffer_iv_length = Buffer.byteLength(buffer_iv)
  const buffer_salt_length = Buffer.byteLength(buffer_salt)

  expect(buffer_iv_length).toBe(16)
  expect(buffer_salt_length).toBe(24)
})

test('generateRandomBytes typeof check', () => {
  const base64 = generateRandomBytes({ type: 'salt', encoding: 'base64' })

  expect(typeof base64).toBe('string')
})
