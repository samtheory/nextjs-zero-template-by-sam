# how-to-zustand

**Purpose:** All Zustand patterns in one feature.

## What You'll Learn
- Basic store (`create`)
- Persisted store (`persist` middleware + localStorage)
- Component-scoped store (createStore + context — no global state leak)
- Disposing / resetting state
- Preventing re-renders with selectors and `useShallow`
- Slices pattern for large stores

## Files
```
store/
  counter.store.ts       — basic store
  theme.store.ts         — persisted store
  accordion.store.ts     — component-scoped store
  auth.store.ts          — reset/dispose pattern
components/
  CounterDemo.tsx
  ThemeDemo.tsx
  AccordionDemo.tsx
```

## Doc Page
`/docs/zustand`
