import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import AuthService from "@/core/services/AuthService";
import { SERVER_ENDPOINT } from "@/env";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
  skipAuthRefresh?: boolean;
}

const MAX_RETRY_ATTEMPTS = 3;
const _axios: AxiosInstance = axios.create();

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const refreshAccessToken = async (): Promise<string | null> => {
  // If there's already a refresh in progress, return the existing promise
  if (refreshPromise) {
    return refreshPromise;
  }

  try {
    // Create new refresh promise
    refreshPromise = (async () => {
      try {
        const refreshToken = await AuthService.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post<TokenResponse>(
          `${SERVER_ENDPOINT}/refresh`,
          { refresh_token: refreshToken },
          { skipAuthRefresh: true } as CustomAxiosRequestConfig,
        );

        const { access_token, refresh_token } = response.data;
        await AuthService.setTokens({ access_token, refresh_token });
        return access_token;
      } finally {
        // Clear the promise reference once complete
        refreshPromise = null;
      }
    })();

    return await refreshPromise;
  } catch (error) {
    console.error("Token refresh failed:", error);
    await AuthService.clearAuth();
    refreshPromise = null;
    return null;
  }
};

const onErrorResponse = async (error: AxiosError | Error): Promise<any> => {
  if (!axios.isAxiosError(error)) {
    console.error(`🚨 [API] | Error ${error.message}`);
    return Promise.reject(error);
  }

  const { config, response } = error;
  const originalRequest = config as CustomAxiosRequestConfig;

  // Initialize retry count if not exists
  originalRequest._retryCount = originalRequest._retryCount || 0;

  const status = response?.status;

  if (status === 401 && !originalRequest.skipAuthRefresh && originalRequest._retryCount < MAX_RETRY_ATTEMPTS) {
    originalRequest._retryCount++;

    if (isRefreshing) {
      try {
        const token = await new Promise<string>((resolve) => {
          subscribeTokenRefresh((token: string) => {
            resolve(token);
          });
        });

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return _axios(originalRequest);
      } catch (err) {
        await AuthService.clearAuth();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        throw new Error("Failed to refresh token");
      }

      onTokenRefreshed(newToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }

      isRefreshing = false;
      return _axios(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      await AuthService.clearAuth();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    }
  } else if (status === 403) {
    window.location.href = "/unauthorized";
  }

  return Promise.reject(error);
};

const onRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const token = await AuthService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  const { method, url } = response.config;
  const { status } = response;
  console.log(`🚀 [API] ${method?.toUpperCase()} ${url} | Response ${status}`);
  return response;
};

const HttpMethods = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
};

const configure = () => {
  _axios.interceptors.request.use(onRequest, onErrorResponse);
  _axios.interceptors.response.use(onResponse, onErrorResponse);
};

const getAxiosClient = () => _axios;

export const HttpService = {
  HttpMethods,
  configure,
  getAxiosClient,
  refreshAccessToken,
};
