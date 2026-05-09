# how-to-auth

**Purpose:** Full authentication flow implementation.

## What You'll Learn
- PocketBase email/password auth
- Storing JWT in a secure cookie via TokenService
- Zustand auth store with persist
- `useLogin` and `useLogout` mutations
- Next.js middleware for route protection
- Reading auth state in Server Components
- Refresh token handling

## Files
```
api/
  auth.keys.ts
  auth.api.ts         — useLogin, useLogout, useMe
  auth.server-api.ts  — loginUser, logoutUser, getMe
models/
  auth.dto.ts
  auth.entity.ts
  auth.payload.ts
store/
  auth.store.ts
validators/
  login.schema.ts
  signup.schema.ts
components/
  LoginForm.tsx
  SignupForm.tsx
  UserAvatar.tsx
```

## Doc Page
`/docs/authentication`
