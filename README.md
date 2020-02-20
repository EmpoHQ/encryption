# @empo/encrpytion

Empo Encryption Module

## Content

- [generateRandomBytes](#generateRandomBytes)
- [SHA](#SHA)
- [AES](#AES)
- [Argon2](#Argon2)

#### generateRandomBytes

```ts
import { generateRandomBytes } from '@empo/encryption'

const buffer = generateRandomBytes({ type: 'iv' })
// <Buffer 7a 38 6e 81 3b 9e e2 58 cd 33 63 45 e7 21 33 2a> (24 length)

const salt = generateRandomBytes({ type: 'salt', encoding: 'base64' })
// lPGLdqGoGMYKFhSxHO9jh6iZmXhQ0wV1aP3Tehymxgg= (32 length)
```

#### SHA

SHA class uses "sha-256" algorithm.

sha is always return same value about same input.

```ts
import { SHA } from '@empo/encryption'

const text = 'password'
const pepper = generateRandomBytes({ type: 'salt', encoding: 'base64' })

const sha = new SHA(pepper)
const encrypted = sha.encrypt(text)
// always return lPGLdqGoGMYKFhSxHO9jh6iZmXhQ0wV1aP3Tehymxgg=
```

#### AES

AES class uses "aes-256-gcm" algorithm

It can be decrpyted.

```ts
import { AES } from '@empo/encryption'

const text = 'password'
const pepper = generateRandomBytes({ type: 'salt', encoding: 'base64' })

const aes = new AES(pepper)
const encrypted = aes.encrypt(text)
// gSqe8O601d6lCOQB9ZGmeVpaRsw02HG+7/uIMiCojqBA0RiRo6DzWg==

const decrypted = aes.decrypt(encrypted)
// password
```

#### Argon2

Argon2 is hash function, uses argon2i algorithm.

It can't be decrpyted, and returned value is always changing about same value.

```ts
import { Argon2 } from '@empo/encryption'

const text = 'password'

// pepper is recommended to store Environment Variable.
const pepper = generateRandomBytes({ type: 'salt', encoding: 'base64' })
const salt = generateRandomBytes({ type: 'salt', encoding: 'base64' })

const argon2 = new Argon2(pepper, salt)

// argon2 returns Promise
const encrypted = await argon2.encrypt(text)
// $argon2i$v=19$m=4096,t=3,p=1$dJGf0ZnY54zC0jGaqKzONA$5l8CBp0yEoEzYzsalRTe0AxplRhJvGAoJMpITHP4WbU

const match = await argon2.match(encrypted, text)
// true
```
