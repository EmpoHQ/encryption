import { generateRandomBytes, AES, Argon2, Sha } from './index'

async function init() {
  try {
    const text = '54011'
    const salt = generateRandomBytes({
      type: 'salt',
      encoding: 'base64'
    }) as string
    const pepper = generateRandomBytes({
      type: 'salt',
      encoding: 'base64'
    }) as string

    const aes = new AES(pepper)
    const twoway_encrypted = aes.encrypt(text)
    const twoway_decrypted = aes.encrypt(twoway_encrypted)

    const sha = new Sha(pepper)
    const sha256 = sha.encrypt(text)

    const argon2 = new Argon2(pepper, salt)
    const oneway_encrypted = await argon2.encrypt(text)
    const oneway_matched = await argon2.match(oneway_encrypted, text)

    console.log({
      salt,
      twoway_encrypted,
      twoway_decrypted,
      sha256,
      oneway_encrypted,
      oneway_matched
    })
  } catch (err) {
    console.error(err)
  }
}

init()
