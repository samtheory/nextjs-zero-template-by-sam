import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { HttpResponse } from "./Types";

/** All HTTP methods supported by the client dispatcher. */
export type TypeMethod = "get" | "delete" | "post" | "put" | "patch" | "download" | "upload";

export interface IQueryProps<TData> {
	/** TanStack Query cache key. Include all params/filters that affect the result. */
	key: unknown[];
	method: TypeMethod;
	url: string;
	/** URL query parameters. */
	params?: unknown;
	/** Request body (for non-GET methods used as queries). */
	body?: unknown;
	options?: UseQueryOptions<HttpResponse<TData>, AxiosError, HttpResponse<TData>, readonly unknown[]>;
	responseType?: string;
	uploadProgress?: (progressEvent: ProgressEvent) => void;
	downloadProgress?: (progressEvent: ProgressEvent) => void;
	/** AbortSignal for manual cancellation (TanStack Query v5 provides one automatically). */
	signal?: AbortSignal;
}

export interface IMutationProps<TData> {
	method: TypeMethod;
	/** Static URL. Can be overridden per-call via `IMutateProps.url`. */
	url?: string;
	options?: UseMutationOptions<unknown, Error, IMutateProps<TData>>;
	message?: string;
	responseType?: string;
	uploadProgress?: (percent: number) => void;
	downloadProgress?: (progressEvent: ProgressEvent) => void;
}

export interface IMutateProps<TData> {
	url?: string;
	data?: TData;
	params?: unknown;
	__filename?: string;
	callMethod?: "get" | "post" | "put" | "patch";
}
