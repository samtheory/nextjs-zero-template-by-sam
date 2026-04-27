/** Body sent to POST /api/collections/users/records */
export interface SignupPayload {
  email: string;
  emailVisibility: boolean;
  name: string;
  password: string;
  passwordConfirm: string;
  avatar?: File;
}

/** Body sent to POST /api/collections/users/auth-with-password */
export interface LoginPayload {
  identity: string;
  password: string;
}

/** Body sent to POST /api/collections/users/request-password-reset */
export interface RequestPasswordResetPayload {
  email: string;
}

/** Body sent to POST /api/collections/users/confirm-password-reset */
export interface ConfirmPasswordResetPayload {
  token: string;
  password: string;
  passwordConfirm: string;
}

/** Body sent to POST /api/collections/users/request-email-change */
export interface RequestEmailChangePayload {
  newEmail: string;
}

/** Body sent to POST /api/collections/users/confirm-email-change */
export interface ConfirmEmailChangePayload {
  token: string;
  password: string;
}
