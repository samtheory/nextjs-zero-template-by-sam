import { useState } from 'react';
import {
  requestEmailChange,
  confirmEmailChange,
} from '../api/auth.api';
import type {
  RequestEmailChangePayload,
  ConfirmEmailChangePayload,
} from '../models/auth.payload';

export function useRequestEmailChange() {
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const request = async (payload: RequestEmailChangePayload): Promise<void> => {
    setIsPending(true);
    setIsError(false);
    setIsSuccess(false);
    setError(null);

    try {
      await requestEmailChange(payload);
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

export function useConfirmEmailChange() {
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const confirm = async (payload: ConfirmEmailChangePayload): Promise<void> => {
    setIsPending(true);
    setIsError(false);
    setIsSuccess(false);
    setError(null);

    try {
      await confirmEmailChange(payload);
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
