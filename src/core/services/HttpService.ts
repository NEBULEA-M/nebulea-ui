// HTTP

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import UserService from "@/core/services/UserService";

const _axios: AxiosInstance = axios.create();


const onErrorResponse = (error: AxiosError | Error): Promise<AxiosError> => {
  if (axios.isAxiosError(error)) {
    const { message } = error;
    const { method, url } = error.config as AxiosRequestConfig;
    const { statusText, status } = error.response as AxiosResponse ?? {};

    console.log(`🚨 [API] ${method?.toUpperCase()} ${url} | Error ${status} ${message}`);

    switch (status) {
      case 401: {
        // "Login required"
        break;
      }
      case 403: {
        // "Permission denied"
        break;
      }
      case 404: {
        // "Invalid request"
        break;
      }
      case 500: {
        // "Server error"
        break;
      }
      default: {
        // "Unknown error occurred"
        break;
      }
    }

    if (status === 401) {
      // Delete Token & Go To Login Page if you required.
      sessionStorage.removeItem("token");
    }
  } else {
    console.log(`🚨 [API] | Error ${error.message}`);
  }

  return Promise.reject(error);
};

const onRequest = (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const successCallback = async (): Promise<InternalAxiosRequestConfig> => {
    config.headers.Authorization = `Bearer ${UserService.getToken()}`;
    return Promise.resolve(config);
  };

  return UserService.updateToken(successCallback);
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
  DELETE: "DELETE"
};

const configure = () => {
  _axios.interceptors.request.use(onRequest, onErrorResponse);
  _axios.interceptors.response.use(onResponse, onErrorResponse);
};


const getAxiosClient = () => _axios;

const HttpService = {
  HttpMethods,
  configure,
  getAxiosClient
};