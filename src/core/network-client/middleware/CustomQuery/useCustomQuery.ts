import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { HttpResponse } from "../../models/Types";
import type { IQueryProps } from "../../models/Model";
import { Request } from "../Axios";

export interface IAxiosResponse<TData> {
	data: TData;
	status: number;
	statusText: string;
	headers: Record<string, string>;
}

/**
 * Wraps TanStack Query's `useQuery` with the shared HTTP client.
 *
 * TanStack Query v5 provides an `AbortSignal` to every `queryFn`. This hook
 * forwards it to the Axios request, so queries are automatically cancelled
 * when the component unmounts or the `queryKey` changes.
 *
 * @example
 * ```ts
 * const { data, isLoading, isError } = useCustomQuery<UserDto[]>({
 *   key: ["users", filters],
 *   method: "get",
 *   url: "/users",
 *   params: filters,
 * });
 * ```
 */
const useCustomQuery = <TData>(QueryProp: IQueryProps<TData>) => {
	const { error, data, isSuccess, isError, isFetched, isLoading, refetch, isFetching, status } =
		useQuery<HttpResponse<TData>, AxiosError, HttpResponse<TData>, readonly unknown[]>({
			queryKey: QueryProp.key,
			queryFn: async ({ signal }) =>
				await Request({
					method: QueryProp.method,
					url: QueryProp.url,
					params: QueryProp.params,
					data: QueryProp?.body,
					uploadProgress: undefined,
					// Use the signal from IQueryProps if provided, otherwise use the
					// one TanStack Query injects automatically (preferred in v5).
					signal: QueryProp.signal ?? signal,
				}),
			placeholderData: keepPreviousData,
			...QueryProp.options,
		});

	return {
		data,
		error,
		isSuccess,
		isError,
		isFetched,
		isLoading,
		refetch,
		isFetching,
		status,
	};
};

export default useCustomQuery;

