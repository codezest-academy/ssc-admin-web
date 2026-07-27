import axios from "axios";
import { useAuthStore } from "../store/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // Needed for HTTP-only cookies if we use them
});

// Request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401s and token refresh (if implemented)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If we receive a 401 Unauthorized, we should clear the token and redirect to login
    // In a production app, we would attempt a silent refresh via a /refresh endpoint here
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      // Prevent infinite loops if the refresh itself fails
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/auth/refresh`,
            {},
            { withCredentials: true }
          );
          
          const newAccessToken = response.data.data.accessToken;
          useAuthStore.getState().setToken(newAccessToken);
          
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);
