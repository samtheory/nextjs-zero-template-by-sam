import { useState } from 'react';
import {
  requestPasswordReset,
  confirmPasswordReset,
} from '../api/auth.api';
import type {
  RequestPasswordResetPayload,
  ConfirmPasswordResetPayload,
} from '../models/auth.payload';

export function useRequestPasswordReset() {
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const request = async (payload: RequestPasswordResetPayload): Promise<void> => {
    setIsPending(true);
    setIsError(false);
    setIsSuccess(false);
    setError(null);

    try {
      await requestPasswordReset(payload);
      setIsSuccess(true);
    } catch (err) {
      const typedError = err instanceof Error ? err : new Error('Request failed');
      setIsError(true);
      setError(typedError);
      throw typedError;
    } finally {
      setIsPending(false);
    }
  };

  return { request, isPending, isError, isSuccess, error };
}

export function useConfirmPasswordReset() {
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const confirm = async (payload: ConfirmPasswordResetPayload): Promise<void> => {
    setIsPending(true);
    setIsError(false);
    setIsSuccess(false);
    setError(null);

    try {
      await confirmPasswordReset(payload);
      setIsSuccess(true);
    } catch (err) {
      const typedError = err instanceof Error ? err : new Error('Confirmation failed');
      setIsError(true);
      setError(typedError);
      throw typedError;
    } finally {
      setIsPending(false);
    }
  };

  return { confirm, isPending, isError, isSuccess, error };
}
