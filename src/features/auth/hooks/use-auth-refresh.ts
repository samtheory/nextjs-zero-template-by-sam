import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTokenService } from '@/presentation/providers/CoreProvider';
import { authKeys } from '../api/auth.keys';
import { authRefresh } from '../api/auth.api';
import { AuthMapper } from '../mappers/auth.mapper';
import type { AuthSessionViewModel } from '../models/auth.viewmodel';

export function useAuthRefresh() {
  const queryClient = useQueryClient();
  const tokenService = useTokenService();
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async (): Promise<AuthSessionViewModel> => {
    setIsPending(true);
    setIsError(false);
    setError(null);

    try {
      const dto = await authRefresh();
      // Update the stored access token with the new one
      tokenService.setAccessToken(dto.token);

      const entity = AuthMapper.authResponseToEntity(dto);
      const viewModel = AuthMapper.sessionToViewModel(entity);

      queryClient.invalidateQueries({ queryKey: authKeys.session() });

      return viewModel;
    } catch (err) {
      const typedError = err instanceof Error ? err : new Error('Token refresh failed');
      setIsError(true);
      setError(typedError);
      throw typedError;
    } finally {
      setIsPending(false);
    }
  };

  return { refresh, isPending, isError, error };
}
