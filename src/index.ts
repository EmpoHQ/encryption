import * as crypto from 'crypto'
import * as argon2 from 'argon2'

export interface RandomByteOptions {
  type: string
  encoding?: string
}

export class Encryption {
  readonly pepper: string
  readonly salt?: string

  private readonly oneway_algorithm = 'sha256'
  private readonly twoway_algorithm = 'aes-256-cbc'

  constructor(_pepper: string, _salt?: string) {
    this.pepper = _pepper
    this.salt = _salt
  }

  generateRandomBytes(options: RandomByteOptions): Buffer | string {
    const { type, encoding } = options
    const getSize = (type: string): number => {
      switch (type) {
        // For AES, this is always 16 buffer length (24 string length)
        case 'iv':
          return 16
        // 단방향 암호화에 필요한 유저 고유 salt 발급용 (32 string length)
        case 'user_salt':
          return 24
        default:
          return 0
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

  shaEncrypt = (value: string): string => {
    const encoding = 'base64'
    const text = value + this.pepper
    return crypto
      .createHmac('sha256', text)
      .update(text)
      .digest(encoding)
  }

  argonEncrypt = (value: string): Promise<string> => {
    const raw = value + this.salt
    // 원본을 sha256로 미리 hash화
    const pre_hash = this.shaEncrypt(raw)
    // argon2으로 다시 hash화
    return argon2.hash(pre_hash)
  }

  argonMatch = async (hash: string, value: string): Promise<boolean> => {
    try {
      const raw = value + this.salt
      const pre_raw = this.shaEncrypt(raw)
      const matched = await argon2.verify(hash, pre_raw)
      return Promise.resolve(matched)
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('argon2i match error', err)
      }
      return Promise.resolve(false)
    }
  }

  twowayEncrpyt = (value: string): string => {
    if (!this.salt) {
      throw Error('salt is undefiend.')
    }
    const raw = `${value}`
    const iv = this.generateRandomBytes({ type: 'iv' })
    const cipher = crypto.createCipheriv(
      this.twoway_algorithm,
      Buffer.from(this.salt),
      iv
    )
    let encrypted = cipher.update(raw)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    // structure => iv:(iv + secret key + raw text)
    // e.g. 8f931f927711dc5cff9e9bc159a5e027:91b3311c98b9798a7f7ed4c208573b3f
    return iv.toString('hex') + ':' + encrypted.toString('hex')
  }

  twowayDecrypt = (encrypted: string): string => {
    if (!this.salt) {
      throw Error('salt is undefiend.')
    }
    const parts = encrypted.split(':')
    const iv = parts.shift()
    if (typeof iv !== 'string') {
      throw Error('iv is not type fo string.')
    }
    const buffer_iv = Buffer.from(iv, 'hex')
    const encrypted_text = Buffer.from(parts.join(':'), 'hex')
    let decipher = crypto.createDecipheriv(
      this.twoway_algorithm,
      Buffer.from(this.salt),
      buffer_iv
    )
    let decrypted = decipher.update(encrypted_text)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
  }
}
