# Crypto Service

AES-GCM encryption and PBKDF2 password hashing via the Web Crypto API.
No external dependencies — works in browser and Node.js 16+.

## Encryption (AES-256-GCM)

```ts
import { encryption } from '@/core/crypto';

const key = await encryption.generateKey();

// Encrypt
const ciphertext = await encryption.encrypt('sensitive data', key);

// Decrypt
const plaintext = await encryption.decrypt(ciphertext, key);

// Persist / share keys
const exported = await encryption.exportKey(key);   // base64 string
const imported = await encryption.importKey(exported);
```

## Hashing

```ts
import { hashService } from '@/core/crypto';

const digest = await hashService.sha256('hello');
const sha512 = await hashService.sha512('hello');

// Password hashing (PBKDF2, 100k iterations)
const { hash, salt } = await hashService.hashPassword('mypassword');
// Store hash + salt in DB, never the plaintext

// Verify
const ok = await hashService.verifyPassword('mypassword', hash, salt);
```

> **Note:** Never store plaintext passwords. Always store `{ hash, salt }`.
