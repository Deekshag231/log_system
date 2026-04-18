export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';

export interface LogEntryRequest {
  timestamp: string; // yyyy-MM-dd'T'HH:mm:ss
  level: LogLevel;
  service: string;
  message: string;
  eventId?: string;
}

export interface LogIngestResponse {
  status: string;
  detail: string;
  eventId: string;
  forwardedToStream: boolean;
}

export interface LogDocument {
  id: string;
  timestamp: string;
  level: string;
  service: string;
  message: string;
  eventId: string;
}

export interface RecentLog {
  eventId: string;
  timestamp: string;
  level: string;
  service: string;
  message: string;
}

export interface AlertRecord {
  id: string;
  triggeredAt: string;
  severity: string;
  title: string;
  detail: string;
  active: boolean;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  details?: string[];
}

export interface AuthTokenResponse {
  tokenType: string;
  accessToken: string;
  expiresInSeconds: number;
}

export interface AuthRegisterResponse {
  username: string;
  message: string;
}

export interface MongoLogRecord {
  id: string;
  eventId: string;
  timestamp: string;
  level: string;
  serviceName: string;
  message: string;
}

export interface WarningRecord {
  id: string;
  warningMessage: string;
  severity: string;
  timestamp: string;
}

export interface UserAccountSummary {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface ForgotPasswordRecord {
  id: string;
  email: string;
  otp: string;
  otpExpiry: string;
}

export interface ResetPasswordRecord {
  id: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
  otp: string;
}

export interface DashboardStats {
  recentLogsCount: number;
  errorCount: number;
  warnCount: number;
  activeAlertsCount: number;
  levelDistribution: { name: string; value: number }[];
}

export interface ServiceInfo {
  service: string;
  bootId: string;
  status: string;
  apiBase: string;
  endpoints: Record<string, string>;
  kibana: string;
}
