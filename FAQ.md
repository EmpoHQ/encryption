# Frequently asked questions

_This document is a work in progress and it is used to collect common questions._

## What is this package for?

This library was privately developed and is still used by the Empo Inc. dev team. Since the beginning, our services have required a wide variety of encryption methods for each endpoint. This particular TypeScript cryptography library is more suitable for our services than other libraries are. The other libraries seem too complicated to understand and apply it to certain functions. Our library is optimized better and lightweight for fast development.

## What type of Argon2 variant do you use and why?

Argon2 has several variants with different aims:

- **Argon2d**: It maximizes resistance to GPU cracking attacks, which is useful for cryptocurrency.

- **Argon2i**: It is optimized to resist tradeoff attacks and side-channel attacks, which is useful for password hashing and key derivation.

- **Argon2id**: A hybrid function of the above, it follows both approaches.

This library uses **Argon2i** for key derivation function (usually for hashing passwords). Argon2i uses data-independent memory access, which is preferred for password hashing and password-based key derivation, but it is slower as it makes more passes over the memory to protect from tradeoff and side-channel attacks.

# Known Issues

