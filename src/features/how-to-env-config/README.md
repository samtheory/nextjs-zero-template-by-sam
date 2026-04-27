# how-to-env-config

**Purpose:** Environment variable setup and validation.

## What You'll Learn
- `.env` file conventions in Next.js
- `NEXT_PUBLIC_` vs server-only variables
- Validating env vars with Zod at startup
- The `appConfig` service for typed config access
- Multi-environment setup (dev/staging/prod)
- CI/CD secret injection

## Files
```
.env.example           — template for required variables
validators/
  env.schema.ts        — Zod schema for process.env
config/
  app-config.ts        — typed config object
components/
  EnvDemo.tsx          — displays current env config (dev only)
```

## Doc Page
`/docs/env-config`
