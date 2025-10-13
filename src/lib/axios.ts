import axios from "axios";
import { useAuthStore } from "../store/auth";

export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE });

// Attach access token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().tokens?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh (if api supports refresh tokens)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;
    if (response?.status === 401 && !config.__isRetry) {
      const { refresh } = useAuthStore.getState();
      const ok = await refresh();
      if (ok) {
        config.__isRetry = true;
        return api(config);
      }
    }
    return Promise.reject(error);
  }
);
