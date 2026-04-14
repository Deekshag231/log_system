import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

const TOKEN_KEY = "accessToken";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: handle unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // Optionally redirect to login page here
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export async function login(username, password) {
  const { data } = await api.post("/auth/login", { username, password });
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  return data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return !!localStorage.getItem(TOKEN_KEY);
}

// Example protected API calls
export async function getRecentLogs(limit = 50) {
  const { data } = await api.get("/logs/recent", { params: { limit } });
  return data;
}

export async function getActiveAlerts() {
  const { data } = await api.get("/alerts/active");
  return data;
}

export async function searchByLevel(level, from, to) {
  const { data } = await api.get("/logs/search/level", {
    params: { level, from, to },
  });
  return data;
}