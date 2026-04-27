import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTokenService } from '@/presentation/providers/CoreProvider';
import { authKeys } from '../api/auth.keys';
import { login } from '../api/auth.api';
import { AuthMapper } from '../mappers/auth.mapper';
import type { LoginPayload } from '../models/auth.payload';
import type { AuthSessionViewModel } from '../models/auth.viewmodel';

export function useLogin() {
  const queryClient = useQueryClient();
  const tokenService = useTokenService();
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loginUser = async (payload: LoginPayload): Promise<AuthSessionViewModel> => {
    setIsPending(true);
    setIsError(false);
    setIsSuccess(false);
    setError(null);

    try {
      const dto = await login(payload);
      // Store the PocketBase token as the access token
      tokenService.setAccessToken(dto.token);

      const entity = AuthMapper.authResponseToEntity(dto);
      const viewModel = AuthMapper.sessionToViewModel(entity);

      setIsSuccess(true);
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      return viewModel;
    } catch (err) {
      const typedError = err instanceof Error ? err : new Error('Login failed');
      setIsError(true);
      setError(typedError);
      throw typedError;
    } finally {
      setIsPending(false);
    }
  };

  return {
    login: loginUser,
    isPending,
    isError,
    isSuccess,
    error,
  };
}
