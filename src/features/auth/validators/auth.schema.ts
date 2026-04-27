import { z } from 'zod';

export const signupSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password is too long'),
    passwordConfirm: z.string().min(1, 'Please confirm your password'),
    emailVisibility: z.boolean(),
    avatar: z.instanceof(File).optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  identity: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const requestPasswordResetSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export type RequestPasswordResetFormValues = z.infer<typeof requestPasswordResetSchema>;

export const confirmPasswordResetSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password is too long'),
    passwordConfirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });

export type ConfirmPasswordResetFormValues = z.infer<typeof confirmPasswordResetSchema>;

export const requestEmailChangeSchema = z.object({
  newEmail: z
    .string()
    .min(1, 'New email is required')
    .email('Invalid email address'),
});

export type RequestEmailChangeFormValues = z.infer<typeof requestEmailChangeSchema>;

export const confirmEmailChangeSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(1, 'Password is required'),
});

export type ConfirmEmailChangeFormValues = z.infer<typeof confirmEmailChangeSchema>;
