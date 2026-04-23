import type { AxiosResponse } from "axios";

/**
 * Standard single-resource API envelope.
 * Most backend endpoints return `{ data: T, message?: string, status: number }`.
 *
 * @template T  The actual payload type.
 *
 * @example
 * ```ts
 * type UserResponse = ApiResponse<UserDto>;
 * const { data } = await api.get<ApiResponse<UserDto>>("/users/1");
 * ```
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

/**
 * Standard paginated list envelope.
 *
 * @template T  The item type for a single page.
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/**
 * The resolved value of every axios call made through this client.
 * Re-exported so callers can type their functions without a direct Axios import.
 */
export type HttpResponse<T = unknown> = AxiosResponse<T>;
