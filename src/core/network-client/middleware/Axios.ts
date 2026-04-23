import { api } from "./ApiRequest";
import type { TypeMethod } from "../models/Model";

/**
 * Unified request dispatcher.
 *
 * Forwards the call to the appropriate `api.*` method based on `method`.
 * Prefer `useCustomQuery` / `useCustomMutation` for React components;
 * use this directly in server actions or plain async functions.
 */
export const Request = ({
	method,
	url,
	params,
	data,
	uploadProgress,
	__filename,
	callMethod,
	signal,
}: {
	method: TypeMethod;
	url: string;
	params?: unknown;
	data?: unknown;
	/** Progress callback — only used when `method === "upload"`. */
	uploadProgress?: (percent: number) => void;
	/** Override filename for downloaded files. Only used when `method === "download"`. */
	__filename?: string;
	/** HTTP method to use for upload / download requests. */
	callMethod?: "get" | "post" | "put" | "patch";
	/** AbortSignal for cancellation. Automatically provided by TanStack Query v5. */
	signal?: AbortSignal;
}) => {
	if (method === "get") return api.get(url, params, signal);
	if (method === "delete") return api.delete(url, data, params);
	if (method === "post") return api.post(url, data, params, signal);
	if (method === "patch") return api.patch(url, data, params, signal);
	if (method === "put") return api.put(url, data, params);
	if (method === "upload")
		return api.upload({
			url,
			body: data as FormData | Record<string, unknown> | null,
			callback: uploadProgress ?? (() => { }),
			params,
			callMethod: callMethod ?? "post",
		});
	if (method === "download")
		return api.download({
			url,
			customfileName: __filename,
			callMethod,
			data,
			params,
		});
};

