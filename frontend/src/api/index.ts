import { authStore } from "@/stores/authStore";
import { Logger } from "@packages/logger";
import { QueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// Create axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  timeout: 30000,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Create queryClient for global use
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Setup request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const accessToken = authStore.getState().accessToken;

    if (accessToken && config.headers) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const REFRESH_ENDPOINT = "/auth/refresh-token";
const LOGOUT_ENDPOINT = "/auth/logout";

let isRefreshingToken = false;

// A queue for API requests that failed while a token refresh was in progress.
let requestQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Processes all requests waiting in the queue.
 * On success, it resolves them with the new token.
 * On failure, it rejects them with the error.
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  requestQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  // Clear the queue after processing.
  requestQueue = [];
};

api.interceptors.response.use(
  (response) => response, // The success path (do nothing)
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest || !doesErrorNeedTokenRefresh(error)) {
      return Promise.reject(error);
    }

    // Mark this request as "attempted to retry" to prevent infinite loops.
    (originalRequest as any)._retry = true;

    if (isRefreshingToken) {
      // If a refresh is already happening, add this request to the waiting line.
      return addRequestToQueue(originalRequest);
    }

    try {
      // Lock to prevent multiple refresh attempts.
      isRefreshingToken = true;

      // Perform the token refresh.
      const newAccessToken = await handleTokenRefresh();

      // Update the original request's header and retry it.
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } finally {
      // Unlock after the process is complete.
      isRefreshingToken = false;
    }
  }
);

const doesErrorNeedTokenRefresh = (error: AxiosError): boolean => {
  const { config: originalRequest, response } = error;

  // It's not a refresh-able error if:
  // 1. We've already tried to refresh for this specific request.
  // 2. It's not a 401 Unauthorized error.
  // 3. The error came from the refresh or logout endpoints themselves.
  if (!originalRequest) return false;

  return !(
    (originalRequest as any)._retry ||
    response?.status !== 401 ||
    [REFRESH_ENDPOINT, LOGOUT_ENDPOINT].includes(originalRequest.url || "")
  );
};

/**
 * Adds a failed request to the queue to be retried later.
 * @param {object} originalRequest The original Axios request config.
 * @returns {Promise} A new promise that resolves when the token is refreshed.
 * When the token is refreshing, this request will be added to the queue.
 */
const addRequestToQueue = (originalRequest: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    requestQueue.push({
      resolve: (token: unknown) => {
        if (token && typeof token === "string") {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          resolve(api(originalRequest));
        } else {
          reject(new Error("Failed to refresh token"));
        }
      },
      reject: (err: unknown) => {
        reject(err);
      },
    });
  });
};

/**
 * Executes the token refresh API call and handles the outcome.
 * On success, it updates the auth store and resolves queued requests. All queued API requests are resolved.
 * On failure, it logs the user out.
 * @returns {Promise<string>} The new access token.
 */
const handleTokenRefresh = async (): Promise<string> => {
  try {
    const { data } = await api.post<{ accessToken: string }>(REFRESH_ENDPOINT);
    const { accessToken } = data;

    if (!accessToken) {
      throw new Error("No access token in refresh response");
    }

    // Success: Update token and process any waiting requests.
    authStore.getState().setTokens(accessToken);
    processQueue(null, accessToken);
    return accessToken;
  } catch (error) {
    // Failure: Clear auth, reject waiting requests, and log out.
    Logger.error("Token refresh failed:", error);
    processQueue(error as Error, null);
    authStore.getState().logout();
    window.location.href = "/signin";
    return Promise.reject(error);
  }
};
