// HTTP

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import AuthService from "@/core/services/AuthService";

const _axios: AxiosInstance = axios.create();

const onErrorResponse = async (error: AxiosError | Error): Promise<AxiosError> => {
  if (axios.isAxiosError(error)) {
    const { message } = error;
    const { method, url } = error.config as AxiosRequestConfig;
    const { statusText, status } = (error.response as AxiosResponse) ?? {};

    console.log(`🚨 [API] ${method?.toUpperCase()} ${url} | Error ${status} ${statusText} ${message}`);

    switch (status) {
      case 401: {
        await AuthService.clearAuth();
        window.location.href = "/login";
        break;
      }
      case 403: {
        window.location.href = "/unauthorized";
        break;
      }
      // ... other cases remain the same
    }
  } else {
    console.log(`🚨 [API] | Error ${error.message}`);
  }

  return Promise.reject(error);
};

const onRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const token = await AuthService.getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  const { method, url } = response.config;
  const { status } = response;
  // Set Loading End Here
  // Handle Response Data Here
  // Error Handling When Return Success with Error Code Here
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
};
