import axios from 'axios';
import { 
  LogEntryRequest, 
  LogIngestResponse, 
  LogDocument, 
  RecentLog, 
  AlertRecord,
  AuthTokenResponse,
  AuthRegisterResponse,
  MongoLogRecord,
  WarningRecord,
  UserAccountSummary,
  ForgotPasswordRecord,
  ResetPasswordRecord,
} from './types';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const BACKEND_ROOT_URL = normalizedBaseUrl.replace(/\/api\/v1$/, '');
const API_BASE_URL = normalizedBaseUrl.endsWith('/api/v1')
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api/v1`;
const ACCESS_TOKEN_KEY = 'accessToken';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (username: string, password: string): Promise<AuthTokenResponse> => {
    const response = await api.post('/auth/login', { username, password });
    localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);
    return response.data;
  },
  register: async (username: string, password: string): Promise<AuthRegisterResponse> => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
  isAuthenticated: () => !!localStorage.getItem(ACCESS_TOKEN_KEY),
};

export const logApi = {
  getServiceInfo: async () => {
    const response = await axios.get(`${BACKEND_ROOT_URL}/`);
    return response.data;
  },
  
  ingestLog: async (log: LogEntryRequest): Promise<LogIngestResponse> => {
    const response = await api.post('/logs', log);
    return response.data;
  },
  
  searchByLevel: async (level: string, size = 50): Promise<LogDocument[]> => {
    const response = await api.get(`/logs/search/level?level=${level}&size=${size}`);
    return response.data;
  },
  
  searchByService: async (name: string, size = 50): Promise<LogDocument[]> => {
    const response = await api.get(`/logs/search/service?name=${name}&size=${size}`);
    return response.data;
  },
  
  searchByMessage: async (query: string, size = 50): Promise<LogDocument[]> => {
    const response = await api.get(`/logs/search/message?q=${query}&size=${size}`);
    return response.data;
  },
  
  searchByRange: async (from: string, to: string, size = 100): Promise<LogDocument[]> => {
    const response = await api.get(`/logs/search/range?from=${from}&to=${to}&size=${size}`);
    return response.data;
  },
  
  getRecentLogs: async (limit = 50): Promise<RecentLog[]> => {
    const response = await api.get(`/logs/recent?limit=${limit}`);
    return response.data;
  },
  
  getActiveAlerts: async (): Promise<AlertRecord[]> => {
    const response = await api.get('/alerts/active');
    return response.data;
  },
};

export const mongoApi = {
  getLogRecords: async (): Promise<MongoLogRecord[]> => {
    const response = await api.get('/mongo/log-records');
    return response.data;
  },
  getWarningRecords: async (): Promise<WarningRecord[]> => {
    const response = await api.get('/mongo/warning-records');
    return response.data;
  },
  getUsers: async (): Promise<UserAccountSummary[]> => {
    const response = await api.get('/mongo/users');
    return response.data;
  },
  getForgotPasswordRecords: async (): Promise<ForgotPasswordRecord[]> => {
    const response = await api.get('/mongo/forgot-password-records');
    return response.data;
  },
  getResetPasswordRecords: async (): Promise<ResetPasswordRecord[]> => {
    const response = await api.get('/mongo/reset-password-records');
    return response.data;
  },
};
