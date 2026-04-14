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

export interface DashboardStats {
  recentLogsCount: number;
  errorCount: number;
  warnCount: number;
  activeAlertsCount: number;
  levelDistribution: { name: string; value: number }[];
}
