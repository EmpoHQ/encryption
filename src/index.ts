import * as crypto from 'crypto'
import * as argon2 from 'argon2'

type RandomByteTypes = 'iv' | 'salt'
type RandomByteEncodingTypes = 'base64'
interface RandomByteOptions {
  type: RandomByteTypes
  encoding?: RandomByteEncodingTypes
}

/**
 * @param {object} options option of function
 */
export const generateRandomBytes = (
  options: RandomByteOptions
): Buffer | string => {
  const { type, encoding } = options
  if (!type) throw new Error('type not defined.')

  const getSize = (type: string): number => {
    switch (type) {
      // For AES, this is always 16 buffer length (24 string length)
      case 'iv':
        return 16
      // 단방향 암호화에 필요한 유저 고유 salt 발급용 (32 string length)
      case 'salt':
        return 24
      default:
        throw new Error('unaccepted type.')
    }
  }
  // Buffer 길이
  const size: number = getSize(type)
  const buffer = crypto.randomBytes(size)

  switch (encoding) {
    case 'base64':
      return buffer.toString('base64')
  }

  return buffer
}

export class AES {
  readonly _salt: string

  constructor(pepper: string) {
    this._salt = pepper
  }

  /**
   * @description 복호화 가능한 양방향 암호화.
   * @param {string} text
   */
  encrypt = (text: string): string => {
    const algorithm = 'aes-256-gcm'
    const iv = generateRandomBytes({ type: 'iv' }) as Buffer
    const cipher = crypto.createCipheriv(algorithm, this._salt, iv)
    const encrypted = Buffer.concat([
      cipher.update(`${text}`, 'utf8'),
      cipher.final()
    ])
    const tag = cipher.getAuthTag()

    return Buffer.concat([iv, tag, encrypted]).toString('base64')
  }

  /**
   * @description 양방향 암호화된 문자열을 원본으로 변환합니다.
   * @param {string} encrypted 암호화된 값 iv + auth tag + encrypted 포맷
   */
  decrypt = (encrypted: string): string => {
    const buffers = Buffer.from(`${encrypted}`, 'base64')

    // convert data to buffers
    const iv = buffers.slice(0, 16)
    const tag = buffers.slice(16, 32)
    const text = buffers.slice(32, 40)

    // AES 256 GCM Mode
    const algorithm = 'aes-256-gcm'
    const decipher = crypto.createDecipheriv(algorithm, this._salt, iv)
    decipher.setAuthTag(tag)

    // encrypt the given text
    const decrypted =
      decipher.update(text, 'binary', 'utf8') + decipher.final('utf8')

    return decrypted
  }
}

export class SHA {
  private _pepper: string

  constructor(pepper: string) {
    this._pepper = pepper
  }

  /**
   * @description plain text를 sha256(base64)로 변환합니다.
   * @param {string} text
   */
  encrypt = (text: string): string => {
    const encoding = 'base64'
    const algorithm = 'sha256'

    return crypto
      .createHmac(algorithm, this._pepper)
      .update(text)
      .digest(encoding)
  }
}

export class Argon2 {
  readonly _pepper: string
  readonly _salt: string

  private readonly SHA: SHA

  constructor(pepper: string, salt: string) {
    this._pepper = pepper
    this._salt = salt

    this.SHA = new SHA(pepper)
  }

  /**
   * @description input 텍스트를 argon2i로 단방향 암호화 합니다.
   * @param {string} text 암호화할 원본 텍스트
   */
  encrypt = (text: string): Promise<string> => {
    if (!this._salt) {
      throw new Error('salt not defiend.')
    }

    const value = text + this._salt
    const pre_hash = this.SHA.encrypt(value)

    return argon2.hash(pre_hash)
  }

  /**
   * @description argon2i로 hash된 텍스트와 input 텍스트와 일치하는지 비교합니다.
   * @param {string} hash argonEncrypt()로 반환된 hash
   * @param {string} text 비교할 원본 텍스트
   */
  match = (hash: string, text: string): Promise<boolean> => {
    const value = text + this._salt
    const pre_raw = this.SHA.encrypt(value)

    return argon2.verify(hash, pre_raw)
  }
}
