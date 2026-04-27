// Models
export type { UserRecordDto, AuthResponseDto, SignupResponseDto } from './models/auth.dto';
export type { UserEntity, AuthSessionEntity } from './models/auth.entity';
export type {
  SignupPayload,
  LoginPayload,
  RequestPasswordResetPayload,
  ConfirmPasswordResetPayload,
  RequestEmailChangePayload,
  ConfirmEmailChangePayload,
} from './models/auth.payload';
export type { UserViewModel, AuthSessionViewModel } from './models/auth.viewmodel';

// Validators
export {
  signupSchema,
  loginSchema,
  requestPasswordResetSchema,
  confirmPasswordResetSchema,
  requestEmailChangeSchema,
  confirmEmailChangeSchema,
} from './validators/auth.schema';
export type {
  SignupFormValues,
  LoginFormValues,
  RequestPasswordResetFormValues,
  ConfirmPasswordResetFormValues,
  RequestEmailChangeFormValues,
  ConfirmEmailChangeFormValues,
} from './validators/auth.schema';

// API
export { authKeys } from './api/auth.keys';
export {
  signup,
  login,
  authRefresh,
  requestPasswordReset,
  confirmPasswordReset,
  requestEmailChange,
  confirmEmailChange,
} from './api/auth.api';

// Hooks
export { useSignup } from './hooks/use-signup';
export { useLogin } from './hooks/use-login';
export { useAuthRefresh } from './hooks/use-auth-refresh';
export { useRequestPasswordReset, useConfirmPasswordReset } from './hooks/use-password-reset';
export { useRequestEmailChange, useConfirmEmailChange } from './hooks/use-email-change';

// Components
export { SignupForm } from './components/signup-form';
export { LoginForm } from './components/login-form';

// Mapper
export { AuthMapper } from './mappers/auth.mapper';
