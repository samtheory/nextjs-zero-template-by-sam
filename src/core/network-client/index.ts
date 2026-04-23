// ─────────────────────────────────────────────────────────────────────────────
// HTTP client (Axios layer)
// ─────────────────────────────────────────────────────────────────────────────
export { api, axiosInstance, configureHttpClient } from "./middleware/ApiRequest";
export type { HttpClientConfig } from "./middleware/ApiRequest";

// Low-level dispatcher — use in server actions or plain async functions.
export { Request } from "./middleware/Axios";

// ─────────────────────────────────────────────────────────────────────────────
// React Query hooks
// ─────────────────────────────────────────────────────────────────────────────
export { default as useCustomQuery } from "./middleware/CustomQuery/useCustomQuery";
export { default as useCustomMutation } from "./middleware/CustomMutation/useCustomMutation";
export type { IAxiosResponse } from "./middleware/CustomQuery/useCustomQuery";

// ─────────────────────────────────────────────────────────────────────────────
// Models & types
// ─────────────────────────────────────────────────────────────────────────────
export type { TypeMethod, IQueryProps, IMutationProps, IMutateProps } from "./models/Model";
export type { ApiResponse, PaginatedResponse, HttpResponse } from "./models/Types";

// ─────────────────────────────────────────────────────────────────────────────
// Error classes & guards
// ─────────────────────────────────────────────────────────────────────────────
export {
  NetworkError,
  ApiError,
  isNetworkError,
  isApiError,
  isUnauthorized,
  isForbidden,
  isNotFound,
  isServerError,
} from "./models/Errors";

// ─────────────────────────────────────────────────────────────────────────────
// Enums & labels
// ─────────────────────────────────────────────────────────────────────────────
export { ValidationResult, HttpStatusCode } from "./models/enum/Enums";
export { HTTP_METHOD_LABEL } from "./models/label";
