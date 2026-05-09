import { z } from "zod";

// ── Full User Schema ──────────────────────────────────────────
// Shows all common Zod validator types in one schema.

export const userSchema = z.object({
  // Strings
  id: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 chars").max(100),
  email: z.string().email("Enter a valid email address"),
  bio: z.string().max(500).optional(),
  website: z.string().url("Must be a valid URL").optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),

  // Numbers
  age: z.number().int("Must be a whole number").min(13).max(120).optional(),
  score: z.number().min(0).max(100).default(0),

  // Booleans
  isActive: z.boolean().default(true),

  // Enums
  role: z.enum(["admin", "editor", "viewer"]),

  // Arrays
  tags: z.array(z.string()).max(10, "Max 10 tags").default([]),

  // Nested object
  address: z
    .object({
      city: z.string(),
      country: z.string().length(2, "Use 2-letter country code"),
    })
    .optional(),

  // Date
  createdAt: z.string().datetime(),
});

// ── Inferred TypeScript type — do NOT write this manually ──
export type User = z.infer<typeof userSchema>;

// ── Derived schemas for different operations ──
export const updateUserSchema = userSchema
  .omit({ id: true, createdAt: true, role: true })
  .partial(); // all fields optional

export const createUserSchema = userSchema.omit({ id: true, createdAt: true, score: true });

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
