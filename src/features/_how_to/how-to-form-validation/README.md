# how-to-form-validation

**Purpose:** Form validation and error handling patterns.

## What You'll Learn
- Client-side Zod validation with React Hook Form
- Cross-field validation (password confirm)
- Mapping server errors back to form fields with `setError`
- Root-level (non-field) error display
- UX patterns: show errors on blur, disable during submit
- Conditional fields based on `watch()`
- Multi-step form with per-step validation

## Files
```
validators/
  contact.schema.ts
  checkout.schema.ts
components/
  ContactForm.tsx        — basic with field errors
  CheckoutForm.tsx       — with server error mapping
  MultiStepForm.tsx      — wizard with per-step Zod schemas
```

## Doc Page
`/docs/form-validation`
