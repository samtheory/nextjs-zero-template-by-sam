import { httpClient } from '@/core/services/http';
import { api } from '@/core/network-client';
import { ErrorMapper } from '@/core/services/error-mapper';
import type { AuthResponseDto, SignupResponseDto } from '../models/auth.dto';
import type {
  SignupPayload,
  LoginPayload,
  RequestPasswordResetPayload,
  ConfirmPasswordResetPayload,
  RequestEmailChangePayload,
  ConfirmEmailChangePayload,
} from '../models/auth.payload';

const USERS_COLLECTION = '/api/collections/users';

// ─── Signup ──────────────────────────────────────────────────────────────────

/**
 * Creates a new user record.
 * Uses multipart/form-data when an avatar file is present, otherwise JSON.
 */
export async function signup(payload: SignupPayload): Promise<SignupResponseDto> {
  try {
    if (payload.avatar) {
      const formData = new FormData();
      formData.append('email', payload.email);
      formData.append('name', payload.name);
      formData.append('password', payload.password);
      formData.append('passwordConfirm', payload.passwordConfirm);
      formData.append('emailVisibility', String(payload.emailVisibility));
      formData.append('avatar', payload.avatar);
      return await api.upload({
        url: `${USERS_COLLECTION}/records`,
        body: formData,
        callback: () => { },
      }) as SignupResponseDto;
    }

    const { avatar: _avatar, ...rest } = payload;
    return await httpClient.post<SignupResponseDto>(`${USERS_COLLECTION}/records`, rest);
  } catch (err) {
    throw ErrorMapper.map(err);
  }
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function login(payload: LoginPayload): Promise<AuthResponseDto> {
  try {
    return await httpClient.post<AuthResponseDto>(
      `${USERS_COLLECTION}/auth-with-password`,
      payload,
    );
  } catch (err) {
    throw ErrorMapper.map(err);
  }
}

// ─── Auth Refresh ─────────────────────────────────────────────────────────────

export async function authRefresh(): Promise<AuthResponseDto> {
  try {
    return await httpClient.post<AuthResponseDto>(`${USERS_COLLECTION}/auth-refresh`);
  } catch (err) {
    throw ErrorMapper.map(err);
  }
}

// ─── Password Reset ───────────────────────────────────────────────────────────

export async function requestPasswordReset(
  payload: RequestPasswordResetPayload,
): Promise<void> {
  try {
    await httpClient.post(`${USERS_COLLECTION}/request-password-reset`, payload);
  } catch (err) {
    throw ErrorMapper.map(err);
  }
}

export async function confirmPasswordReset(
  payload: ConfirmPasswordResetPayload,
): Promise<void> {
  try {
    await httpClient.post(`${USERS_COLLECTION}/confirm-password-reset`, payload);
  } catch (err) {
    throw ErrorMapper.map(err);
  }
}

// ─── Email Change ─────────────────────────────────────────────────────────────

export async function requestEmailChange(
  payload: RequestEmailChangePayload,
): Promise<void> {
  try {
    await httpClient.post(`${USERS_COLLECTION}/request-email-change`, payload);
  } catch (err) {
    throw ErrorMapper.map(err);
  }
}

export async function confirmEmailChange(
  payload: ConfirmEmailChangePayload,
): Promise<void> {
  try {
    await httpClient.post(`${USERS_COLLECTION}/confirm-email-change`, payload);
  } catch (err) {
    throw ErrorMapper.map(err);
  }
}
