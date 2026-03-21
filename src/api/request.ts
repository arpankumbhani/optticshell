import axios, { AxiosError, AxiosHeaders } from "axios";
import type {
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
  ResponseType,
} from "axios";
import type { ApiError } from "../Types/Api.type";
import { useAuthStore } from "../store/authStore";
import UseToast from "../hooks/useToast";

axios.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    let authToken = useAuthStore.getState().token;

    useAuthStore.subscribe((state) => {
      authToken = state.token;
    });

    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    config.headers["ngrok-skip-browser-warning"] = "true";

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    if (response.headers["content-type"]?.includes("application/json")) {
      const data = response.data;
      if (data.status) {
        return data;
      } else {
        return Promise.reject(data);
      }
    } else if (response.status === 200) {
      return response;
    }

    return Promise.reject(response);
  },
  function (error: AxiosError<{ message?: string }>) {
    if (error?.response?.status === 400) {
      UseToast(error.message, "error");
    }
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      UseToast(error.message || "User No longer exist", "error");
      window.location.href = "/signin";
    }

    const message =
      error.response?.status === 404
        ? "API not found."
        : error.response?.data?.message || "Something went wrong";

    return Promise.reject({ message } satisfies ApiError);
  }
);

export const request = async <
  TResponse,
  TParams = Record<string, unknown>,
  TBody = unknown,
  THeaders extends AxiosRequestHeaders = AxiosRequestHeaders
>({
  url,
  method = "GET",
  params,
  body,
  headers,
  responseType,
}: {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: TParams;
  body?: TBody;
  headers?: THeaders;
  responseType?: ResponseType;
}): Promise<TResponse> => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const res = await axios.request<TResponse>({
    url: BASE_URL + url,
    method,
    params,
    data: body,
    headers: headers as AxiosRequestHeaders | undefined,
    responseType,
  });

  return res as TResponse;
};
