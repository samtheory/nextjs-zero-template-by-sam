import type { AxiosResponse } from 'axios';
import { api } from '../../network-client/middleware/ApiRequest';

/**
 * Type-safe wrapper around the shared `api` object from the network client.
 *
 * Adds TypeScript generics for typed return values. Use the `*Raw` variants
 * when you need access to response headers or the full Axios envelope; use
 * the unwrapped variants when you only need `response.data`.
 *
 * The underlying `api` object handles auth token injection, silent refresh,
 * and error normalisation automatically.
 *
 * @example
 * ```ts
 * const user = await httpClient.get<ApiResponse<User>>('/users/me');
 * console.log(user.data.name);
 * ```
 */
export class HttpClient {
  // ─── GET ──────────────────────────────────────────────────────────────────

  /**
   * GET — returns the full AxiosResponse typed as `T`.
   * Use when you need headers or the Axios envelope.
   */
  async getRaw<T>(
    url: string,
    params?: unknown,
    signal?: AbortSignal,
  ): Promise<AxiosResponse<T>> {
    return api.get(url, params, signal) as Promise<AxiosResponse<T>>;
  }

  /**
   * GET — returns `response.data` typed as `T` (unwrapped).
   * Use for standard `ApiResponse<T>` envelopes.
   */
  async get<T>(url: string, params?: unknown, signal?: AbortSignal): Promise<T> {
    const response = await this.getRaw<T>(url, params, signal);
    return response.data;
  }

  // ─── POST ─────────────────────────────────────────────────────────────────

  /**
   * POST — returns the full AxiosResponse typed as `T`.
   */
  async postRaw<T>(
    url: string,
    body?: unknown,
    params?: unknown,
  ): Promise<AxiosResponse<T>> {
    return api.post(url, body, params) as Promise<AxiosResponse<T>>;
  }

  /**
   * POST — returns `response.data` typed as `T` (unwrapped).
   */
  async post<T>(url: string, body?: unknown, params?: unknown): Promise<T> {
    const response = await this.postRaw<T>(url, body, params);
    return response.data;
  }

  // ─── PUT ──────────────────────────────────────────────────────────────────

  /**
   * PUT — returns the full AxiosResponse typed as `T`.
   */
  async putRaw<T>(
    url: string,
    body?: unknown,
    params?: unknown,
  ): Promise<AxiosResponse<T>> {
    return api.put(url, body, params) as Promise<AxiosResponse<T>>;
  }

  /**
   * PUT — returns `response.data` typed as `T` (unwrapped).
   */
  async put<T>(url: string, body?: unknown, params?: unknown): Promise<T> {
    const response = await this.putRaw<T>(url, body, params);
    return response.data;
  }

  // ─── PATCH ────────────────────────────────────────────────────────────────

  /**
   * PATCH — returns the full AxiosResponse typed as `T`.
   */
  async patchRaw<T>(
    url: string,
    body?: unknown,
    params?: unknown,
  ): Promise<AxiosResponse<T>> {
    return api.patch(url, body, params) as Promise<AxiosResponse<T>>;
  }

  /**
   * PATCH — returns `response.data` typed as `T` (unwrapped).
   */
  async patch<T>(url: string, body?: unknown, params?: unknown): Promise<T> {
    const response = await this.patchRaw<T>(url, body, params);
    return response.data;
  }

  // ─── DELETE ───────────────────────────────────────────────────────────────

  /**
   * DELETE — returns the full AxiosResponse typed as `T`.
   */
  async deleteRaw<T>(
    url: string,
    body?: unknown,
    params?: unknown,
  ): Promise<AxiosResponse<T>> {
    return api.delete(url, body, params) as Promise<AxiosResponse<T>>;
  }

  /**
   * DELETE — returns `response.data` typed as `T` (unwrapped).
   */
  async delete<T>(url: string, body?: unknown, params?: unknown): Promise<T> {
    const response = await this.deleteRaw<T>(url, body, params);
    return response.data;
  }
}

/** Singleton HttpClient instance for use throughout the application. */
export const httpClient = new HttpClient();
