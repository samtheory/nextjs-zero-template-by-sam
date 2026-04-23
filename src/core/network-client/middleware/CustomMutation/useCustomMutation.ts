import { useMutation } from "@tanstack/react-query";
import { isApiError } from "../../models/Errors";
import { IMutateProps, IMutationProps } from "../../models/Model";
import { Request } from "../Axios";

/**
 * Wraps TanStack Query's `useMutation` with the shared HTTP client.
 *
 * The 401 token-refresh cycle is handled transparently by the Axios
 * response interceptor — no retry logic is needed at this layer.
 * This hook retries once on transient server errors (5xx / network failures)
 * and never retries on 4xx client errors.
 *
 * @example
 * ```ts
 * const { mutate, isPending, isError, error } = useCustomMutation<CreateUserPayload>({
 *   method: "post",
 *   url: "/users",
 * });
 *
 * mutate({ data: { name: "Alice" } });
 * ```
 */
const useCustomMutation = <TData>(mutationProp: IMutationProps<TData>) => {
	const { mutate, mutateAsync, isError, isSuccess, isPending, data, error } = useMutation<
		unknown,
		Error,
		IMutateProps<TData>
	>({
		mutationFn: async (body: IMutateProps<TData>) =>
			await Request({
				method: mutationProp.method,
				url: mutationProp.url ?? body?.url ?? "",
				params: body?.params,
				data: body?.data,
				uploadProgress: mutationProp?.uploadProgress,
				__filename: body?.__filename,
				callMethod: body?.callMethod,
			}),
		// Never retry 4xx errors — they represent a client mistake.
		// 401 refresh is already handled by the Axios interceptor, so a 401
		// reaching here means auth completely failed and the user was redirected.
		// Retry once on 5xx / network failures.
		retry: (failureCount, err: unknown) => {
			if (isApiError(err) && err.status >= 400 && err.status < 500) return false;
			return failureCount < 1;
		},
		...mutationProp?.options,
	});

	return { mutate, mutateAsync, isSuccess, isError, isPending, data, error };
};

export default useCustomMutation;

