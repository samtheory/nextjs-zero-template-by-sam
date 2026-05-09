# how-to-core-services

**Purpose:** How to use the core infrastructure services.

## What You'll Learn
- HTTP client (Axios wrapper) for API calls
- Token service via CoreProvider context
- Client-side cookie service
- Server-side cookie service (for RSC/middleware)
- Storage factory (SSR-safe localStorage/sessionStorage)
- Using storage in Zustand persist middleware

## Files
```
components/
  HttpClientDemo.tsx       — httpClient GET/POST/PATCH/DELETE
  TokenServiceDemo.tsx     — get/set/clear token
  CookieDemo.tsx           — client vs server cookie usage
  StorageDemo.tsx          — localStorage with SSR safety
  ZustandPersistDemo.tsx   — storage factory in zustand persist
```

## Doc Page
`/docs/core-services`
