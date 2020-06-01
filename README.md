[![npm version](https://badge.fury.io/js/%40empo%2Fencryption.svg)](https://badge.fury.io/js/%40empo%2Fencryption) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/empo-dev/encryption/build) [![Coverage Status](https://coveralls.io/repos/github/EMPO-dev/encryption/badge.svg?branch=master)](https://coveralls.io/github/EMPO-dev/encryption?branch=master) ![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/github/EMPO-dev/encryption) ![Dependabot for update dependencies](https://badgen.net/dependabot/EMPO-dev/encryption?icon=dependabot) ![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/@empo/encryption)

A TypeScript library for widely used crypto standards.

## Features

- Generate a random key for IV (24-byte long) or salt (32-byte long) using [CSPRNG](https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator) (Cryptographically-secure PRNG)
- HMAC-SHA256 encryption
- AES256-GCM encryption and decryption
- Argon2i key derivation and hash verification

## Installation

This is a Node.js package available through the [npm registry](https://www.npmjs.com/). Before installing this package, [download and install Node.js](https://nodejs.org/en/download/). Node.js v10.0.0 or higher is required.

Installation is done by using npm:
```sh
npm install @empo/encryption
```

## Usage

### Generate a random key

This provides **CSPRNG**, to be used as a cryptographic function (e.g. AES, SHA, Argon2) backend. The length of the output value is determined by its type (IV or salt).

```ts
import { generateRandomBytes } from '@empo/encryption'

const buffer = generateRandomBytes({ type: 'iv' })
// Generate a 24-byte String random IV (e.g. jK8OuOTY63qQ0WlAOvcBPA==)

const salt = generateRandomBytes({ type: 'salt', encoding: 'base64' })
// Generate a 32-byte String random salt (e.g. Zq0E3sDcmEJG8p3CAQ6qMsP5F5Dz3x38)
```

### Encryption

This provides a basic API for block cipher encryption using **AES256-GCM**.

```ts
import { AES } from '@empo/encryption'

const plaintext = 'password'
// This is required for the encryption/decryption (e.g. Zq0E3sDcmEJG8p3CAQ6qMsP5F5Dz3x38)
const pepper = generateRandomBytes({ type: 'salt', encoding: 'base64' })

const aes = new AES(pepper)

const encrypted = aes.encrypt(plaintext)
// Outputs Base64 encoded value (e.g. oy8MGB2ZgZttF2BRoRfn7sbPBnBzksB9)
```

### Decryption

This provides a basic API for block cipher decryption using **AES256-GCM**.

```ts
import { AES } from '@empo/encryption'

const plaintext = 'password'
// This is required for the encryption/decryption (e.g. Zq0E3sDcmEJG8p3CAQ6qMsP5F5Dz3x38)
const pepper = generateRandomBytes({ type: 'salt', encoding: 'base64' })

const aes = new AES(pepper)
const encrypted = aes.encrypt(plaintext)

const decrypted = aes.decrypt(encrypted)
// Outputs UTF-8 encoded value (e.g. password)
```

### Secure hash function

This provides a secure hash function using **HMAC with SHA256**. A hash function is deterministic — meaning that for a given input value it must always generate the same hash value, and the function can't be reversible.

```ts
import { SHA } from '@empo/encryption'

const plaintext = 'password'
// This is required for the cryptographic function (e.g. Zq0E3sDcmEJG8p3CAQ6qMsP5F5Dz3x38)
const pepper = generateRandomBytes({ type: 'salt', encoding: 'base64' })

const sha = new SHA(pepper)

const encrypted = sha.encrypt(plaintext)
// Outputs Base64 encoded value (e.g. IIU+YYIz6XDvNAObEOW+GymC0GiH8fW3SokPbP9P+xg=)
```

This provides a key derivation function using **Argon2** algorithm. A key derivation function is a cryptographic hash function that derives one or more secret keys such as a password, or a passphrase using pseudorandom function — meaning that for a given input value it must always generate different hash value, and the function can't be reversible.

```ts
import { Argon2 } from '@empo/encryption'

const plaintext = 'password'

// Pepper is similar to salt but stored in the application environment variables, not in DB.
// e.g. Zq0E3sDcmEJG8p3CAQ6qMsP5F5Dz3x38
const pepper = generateRandomBytes({ type: 'salt', encoding: 'base64' })
const salt = generateRandomBytes({ type: 'salt', encoding: 'base64' })

const argon2 = new Argon2(pepper, salt)

const encrypted = await argon2.encrypt(text)
// Outputs hashed value
// e.g. $argon2i$v=19$m=4096,t=3,p=1$dJGf0ZnY54zC0jGaqKzONA$5l8CBp0yEoEzYzsalRTe0AxplRhJvGAoJMpITHP4WbU

const match = await argon2.match(encrypted, text)
// Verify hashed value (outputs True or False)
```

## FAQ

See [FAQ.md](https://github.com/EMPO-dev/encryption/blob/master/FAQ.md).

## License

This package is freely distributable under the terms of the [MIT license](https://github.com/EMPO-dev/encryption/blob/master/LICENSE). When required, please check [P-H-C/phc-winner-argon2](https://github.com/P-H-C/phc-winner-argon2) for license over Argon2 and the reference implementation.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FEMPO-dev%2Fencryption.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FEMPO-dev%2Fencryption?ref=badge_large)