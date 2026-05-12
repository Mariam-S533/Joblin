export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiClientOptions = {
  method?: HttpMethod;
  body?: BodyInit | object | null;
  headers?: HeadersInit;
};
