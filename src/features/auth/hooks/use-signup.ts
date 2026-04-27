import { useCustomMutation } from '@/core/network-client';
import { useTokenService } from '@/presentation/providers/CoreProvider';
import { authKeys } from '../api/auth.keys';
import { signup } from '../api/auth.api';
import { AuthMapper } from '../mappers/auth.mapper';
import type { SignupPayload } from '../models/auth.payload';
import type { UserViewModel } from '../models/auth.viewmodel';
import { useQueryClient } from '@tanstack/react-query';

export function useSignup() {
  const queryClient = useQueryClient();
  const tokenService = useTokenService();

  const mutation = useCustomMutation<SignupPayload>({
    method: 'post',
    url: '/api/collections/users/records',
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: authKeys.all });
      },
    },
  });

  // Wrap mutateAsync to call the typed API function and handle token storage
  const signupUser = async (payload: SignupPayload): Promise<UserViewModel> => {
    const dto = await signup(payload);
    const entity = AuthMapper.recordToEntity(dto);
    return AuthMapper.userToViewModel(entity);
  };

  return {
    signup: signupUser,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}
