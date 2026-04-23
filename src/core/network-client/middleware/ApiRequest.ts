import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { ApiError, NetworkError } from "../models/Errors";

// ─────────────────────────────────────────────────────────────────────────────
// Client configuration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Injectable auth functions that keep the HTTP client decoupled from any
 * specific cookie library or storage strategy.
 *
 * Call `configureHttpClient()` once — before any request is made — passing
 * your app's concrete implementations. A good place is a root Provider or
 * Next.js layout.
 *
 * @example
 * ```ts
 * // src/app/layout.tsx  (or a <HttpClientProvider> component)
 * configureHttpClient({
 *   getAccessToken:   () => Cookies.get("access_token") ?? null,
 *   getRefreshToken:  () => Cookies.get("refresh_token") ?? null,
 *   setAccessToken:   (t) => Cookies.set("access_token", t, { expires: 7 }),
 *   setRefreshToken:  (t) => Cookies.set("refresh_token", t, { expires: 30 }),
 *   removeAuthTokens: () => { Cookies.remove("access_token"); Cookies.remove("refresh_token"); },
 *   refreshEndpoint:  "/auth/refresh",
 *   onAuthFailure:    () => router.push("/login"),
 * });
 * ```
 */
export interface HttpClientConfig {
	/** Returns the current access token, or null if absent. */
	getAccessToken: () => string | null;
	/** Returns the current refresh token, or null if absent. */
	getRefreshToken: () => string | null;
	/** Persists the new access token after a successful refresh. */
	setAccessToken: (token: string, expiresInDays?: number) => void;
	/** Persists the new refresh token after a successful refresh. */
	setRefreshToken: (token: string, expiresInDays?: number) => void;
	/** Removes all auth tokens (called on logout or auth failure). */
	removeAuthTokens: () => void;
	/** The API endpoint used to exchange a refresh token for a new access token. */
	refreshEndpoint: string;
	/**
	 * Called when authentication fully fails (no refresh token, or refresh
	 * request itself returned an error). Defaults to `window.location.href = "/login"`.
	 */
	onAuthFailure?: () => void;
}

/** Mutable config — populated by `configureHttpClient()`. */
let clientConfig: HttpClientConfig | null = null;

/**
 * Initialise the HTTP client with your app's auth functions.
 * Must be called before the first authenticated request.
 */
export const configureHttpClient = (config: HttpClientConfig): void => {
	clientConfig = config;
};

// ─────────────────────────────────────────────────────────────────────────────
// Base URL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * All requests are routed through a Next.js proxy route (`/api/proxy`) so the
 * real backend URL is never exposed to the browser.
 * Override via the `NEXT_PUBLIC_API_BASE_URL` environment variable.
 */
const ROOT_URL = process.env["NEXT_PUBLIC_API_BASE_URL"] ?? "/api/proxy";

// ─────────────────────────────────────────────────────────────────────────────
// Refresh-token queue
// ─────────────────────────────────────────────────────────────────────────────

/** True while a token-refresh request is in flight. */
let isRefreshing = false;

/** Requests that arrived while a refresh was in progress. */
let failedQueue: Array<{
	resolve: (token: string) => void;
	reject: (error: unknown) => void;
}> = [];

/**
 * Drain the queue after a refresh attempt completes.
 * @param error - Pass the error to reject all queued promises, or null on success.
 * @param token - The new access token to resolve all queued promises.
 */
const drainQueue = (error: unknown, token: string | null = null): void => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) reject(error);
		else resolve(token!);
	});
	failedQueue = [];
};

// ─────────────────────────────────────────────────────────────────────────────
// Internal type
// ─────────────────────────────────────────────────────────────────────────────

type TypeMethod = "get" | "delete" | "post" | "put" | "patch";

// ─────────────────────────────────────────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────────────────────────────────────────

export const axiosInstance = axios.create({
	baseURL: ROOT_URL,
	withCredentials: true,
	headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach Bearer token ──────────────────────────────────
axiosInstance.interceptors.request.use(
	(config) => {
		const token = clientConfig?.getAccessToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: AxiosError) => Promise.reject(error),
);

// ── Response interceptor: 401 silent-refresh + error normalisation ────────────
axiosInstance.interceptors.response.use(
	(response) => response,
	async (err: AxiosError) => {
		const originalRequest = err.config as AxiosRequestConfig & { _retry?: boolean };

		// ── 401 → attempt silent token refresh ────────────────────────────────
		if (err.response?.status === 401 && !originalRequest._retry) {
			if (!clientConfig) {
				// Client was not configured — cannot refresh, reject immediately.
				return Promise.reject(normaliseError(err));
			}

			if (isRefreshing) {
				// A refresh is already in flight — queue this request until it resolves.
				return new Promise<string>((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						if (originalRequest.headers) {
							originalRequest.headers["Authorization"] = `Bearer ${token}`;
						}
						return axiosInstance(originalRequest);
					})
					.catch(() => Promise.reject(normaliseError(err)));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			const refreshToken = clientConfig.getRefreshToken();
			if (!refreshToken) {
				handleAuthFailure();
				return Promise.reject(normaliseError(err));
			}

			try {
				const { data } = await axiosInstance.post<{
					data: { accessToken: string; refreshToken: string };
				}>(clientConfig.refreshEndpoint, { refreshToken });

				const { accessToken, refreshToken: newRefreshToken } = data.data;
				clientConfig.setAccessToken(accessToken, 7);
				clientConfig.setRefreshToken(newRefreshToken, 30);

				drainQueue(null, accessToken);

				originalRequest.headers = {
					...originalRequest.headers,
					Authorization: `Bearer ${accessToken}`,
				};
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				drainQueue(refreshError, null);
				handleAuthFailure();
				return Promise.reject(normaliseError(refreshError as AxiosError));
			} finally {
				isRefreshing = false;
			}
		}

		// ── All other errors → normalise to ApiError / NetworkError ───────────
		return Promise.reject(normaliseError(err));
	},
);

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Clear tokens and invoke the configured auth-failure callback (or fallback to redirect). */
const handleAuthFailure = (): void => {
	clientConfig?.removeAuthTokens();
	if (clientConfig?.onAuthFailure) {
		clientConfig.onAuthFailure();
	} else if (typeof window !== "undefined") {
		window.location.href = "/login";
	}
};

/**
 * Convert any thrown value into a typed `ApiError` or `NetworkError` so that
 * every consumer of this client receives a predictable, structured error.
 */
const normaliseError = (err: unknown): ApiError | NetworkError => {
	if (axios.isAxiosError(err)) {
		const status = err.response?.status ?? 0;
		const message =
			(err.response?.data as { message?: string } | undefined)?.message ??
			err.message ??
			"An unexpected error occurred";
		return new ApiError(message, status, err.response?.data);
	}
	if (err instanceof Error) return new NetworkError(err.message, 0);
	return new NetworkError("An unexpected error occurred", 0);
};
// ─────────────────────────────────────────────────────────────────────────────
// Internal HTTP executor
// ─────────────────────────────────────────────────────────────────────────────

const httpRequest = async (
	method: TypeMethod,
	url: string,
	body?: unknown,
	params?: unknown,
	signal?: AbortSignal,
) => {
	switch (method) {
		case "get":
			return axiosInstance.get(url, { params: body, signal });
		case "delete":
			return body
				? axiosInstance.delete(url, { data: body, signal })
				: axiosInstance.delete(url, { params, signal });
		default:
			return axiosInstance[method](url, body, { params, signal });
	}
};

// ─────────────────────────────────────────────────────────────────────────────
// Public API object
// ─────────────────────────────────────────────────────────────────────────────

export const api = {
	get: (url: string, params?: unknown, signal?: AbortSignal) =>
		httpRequest("get", url, params, undefined, signal),

	delete: (url: string, body?: unknown, params?: unknown) =>
		httpRequest("delete", url, body, params),

	post: (url: string, body?: unknown, params?: unknown, signal?: AbortSignal) =>
		httpRequest("post", url, body, params, signal),

	put: (url: string, body?: unknown, params?: unknown) =>
		httpRequest("put", url, body, params),

	patch: (url: string, body?: unknown, params?: unknown, signal?: AbortSignal) =>
		httpRequest("patch", url, body, params, signal),

	/**
	 * Upload a file with real-time progress tracking.
	 *
	 * Uses the shared `axiosInstance` so the Bearer token is automatically
	 * included — the previous implementation created a new axios instance
	 * that bypassed authentication.
	 *
	 * @example
	 * ```ts
	 * await api.upload({
	 *   url: "/files",
	 *   body: formData,
	 *   callback: (percent) => setProgress(percent),
	 * });
	 * ```
	 */
	async upload({
		url,
		body = null,
		callback,
		params,
		callMethod = "post",
	}: {
		url: string;
		body: FormData | Record<string, unknown> | null;
		callback: (percent: number) => void;
		params?: unknown;
		callMethod?: "get" | "post" | "put" | "patch";
	}) {
		const response = await axiosInstance.request({
			url,
			method: callMethod,
			data: body,
			params,
			headers: { "Content-Type": "multipart/form-data" },
			onUploadProgress: (progressEvent) => {
				const total = progressEvent.total ?? 1;
				const percent = Math.floor((progressEvent.loaded * 100) / total);
				callback(percent);
			},
		});
		return response.data;
	},

	/**
	 * Download a file as a Blob and trigger a browser Save dialog.
	 *
	 * Uses the shared `axiosInstance` so the Bearer token is automatically
	 * included — the previous implementation used a bare `axios()` call
	 * that bypassed authentication.
	 *
	 * @example
	 * ```ts
	 * await api.download({ url: "/reports/monthly", customfileName: "report.pdf" });
	 * ```
	 */
	async download({
		url,
		customfileName,
		callMethod = "get",
		data,
		params,
	}: {
		url: string;
		customfileName?: string;
		callMethod?: "get" | "post" | "put" | "patch";
		data?: unknown;
		params?: unknown;
	}) {
		try {
			const response = await axiosInstance.request({
				url,
				method: callMethod,
				responseType: "blob",
				headers: { Accept: "application/octet-stream" },
				data,
				params,
			});

			const blobUrl = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
			const link = document.createElement("a");
			link.href = blobUrl;
			const fallbackName = url.split("/").pop() ?? "download";
			link.setAttribute("download", customfileName ?? fallbackName);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(blobUrl);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
				const text = await (error.response.data as Blob).text();
				try {
					const parsed = JSON.parse(text) as { message?: string };
					return Promise.reject(
						new ApiError(parsed.message ?? text, error.response.status, parsed),
					);
				} catch {
					return Promise.reject(new ApiError(text, error.response?.status ?? 500));
				}
			}
			return Promise.reject(normaliseError(error));
		}
	},
};

