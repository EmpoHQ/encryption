![NPM version](https://img.shields.io/npm/v/@empo/encryption) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/empo-dev/encryption/build) [![Coverage Status](https://coveralls.io/repos/github/EMPO-dev/encryption/badge.svg?branch=master)](https://coveralls.io/github/EMPO-dev/encryption?branch=master) ![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/github/EMPO-dev/encryption) ![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/@empo/encryption) ![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/@empo/encryption)

A JavaScript library for widely used crypto standards.

## Features

- Generate a random key for IV (24-byte long) or salt (32-byte long) using [CSPRNG](https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator) (Cryptographically-secure PRNG)
- HMAC-SHA256 encryption
- AES256-GCM encryption
- Argon2i encryption and hash verification

## Documentation

- [Installation](#Installation)

#### Ciphers

- [AES](#AES)

#### Message Digests

- [SHA](#SHA)
- [Argon2](#Argon2)

#### Utilities
- [CSPRNG](#CSPRNG)

## Installation

This is a Node.js package available through the [npm registry](https://www.npmjs.com/).

Before installing this package, [download and install Node.js](https://nodejs.org/en/download/). Node.js v10.0.0 or higher is required.

Installation is done by using npm:
```sh
npm install @empo/encryption
```

## AES

This provides a basic API for block encryption and decryption using **AES256-GCM**.

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

## SHA

This provides a secure hash function using **HMAC with SHA256**. A hash function is deterministic — meaning that for a given input value it must always generate the same hash value.

```ts
import { SHA } from '@empo/encryption'

const text = 'password'
const pepper = generateRandomBytes({ type: 'salt', encoding: 'base64' })

const sha = new SHA(pepper)
const encrypted = sha.encrypt(text)
// always return lPGLdqGoGMYKFhSxHO9jh6iZmXhQ0wV1aP3Tehymxgg=
```

## Argon2

This provides a key derivation function using **Argon2i** algorithm. Argon2 has several variants with different aims:

- **Argon2d**: It maximizes resistance to GPU cracking attacks, which is useful for cryptocurrency.

- **Argon2i**: It is optimized to resist tradeoff attacks and side-channel attacks, which is useful for password hashing and key derivation.

- **Argon2id**: A hybrid function of the above, it follows both approaches.

A key derivation function is a cryptographic hash function that derives one or more secret keys such as a password, or a passphrase using pseudorandom function — meaning that for a given input value it must always generate different hash value.

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

## CSPRNG

This provides cryptographically-secure PRNG, to be used as a cryptographic function (e.g. AES, SHA, Argon2) backend. The length of the output value is determined by its type (IV or salt).

```ts
import { generateRandomBytes } from '@empo/encryption'

const buffer = generateRandomBytes({ type: 'iv' })
// <Buffer 7a 38 6e 81 3b 9e e2 58 cd 33 63 45 e7 21 33 2a> (24 length)

const salt = generateRandomBytes({ type: 'salt', encoding: 'base64' })
// lPGLdqGoGMYKFhSxHO9jh6iZmXhQ0wV1aP3Tehymxgg= (32 length)
```

## FAQ

See [FAQ.md](https://github.com/EMPO-dev/encryption/blob/master/FAQ.md).

## License

This package is freely distributable under the terms of the [MIT license](https://github.com/EMPO-dev/encryption/blob/master/LICENSE). When required, please check [P-H-C/phc-winner-argon2](https://github.com/P-H-C/phc-winner-argon2) for license over Argon2 and the reference implementation.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FEMPO-dev%2Fencryption.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FEMPO-dev%2Fencryption?ref=badge_large)