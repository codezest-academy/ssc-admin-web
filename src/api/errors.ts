import { api } from '../lib/axios';

export interface ErrorReport {
  id: string;
  fingerprint: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'UNRESOLVED' | 'IN_PROGRESS' | 'RESOLVED' | 'IGNORED' | 'REGRESSED';
  occurrenceCount: number;
  affectedUserCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string;
  url: string;
  routePath?: string;
  routeParams?: any;
  userAgent?: string;
  appVersion?: string;
  lastAffectedUser?: { id: string; name: string; email: string };
  assignedTo?: { id: string; name: string; email: string };
  resolvedBy?: { id: string; name: string; email: string };
  resolvedAt?: string;
  notes?: string;
}

export interface ErrorAnalytics {
  summary: {
    totalUnresolved: number;
    totalInProgress: number;
    totalResolved: number;
    totalRegressed: number;
    totalCriticalLast24h: number;
    totalImpactScore: number;
  };
  impactBySeverity: { severity: string; count: number; affectedUsers: number; impactScore: number }[];
  mttrBySeverity: { severity: string; avgMttrSeconds: number }[];
  topRoutes: { routePath: string; affectedUsers: number; occurrences: number }[];
  trendByDay: Record<string, number>;
}

export const errorsApi = {
  list: async (params?: Record<string, any>) => {
    const res = await api.get('/errors', { params });
    return res.data;
  },
  
  getById: async (id: string): Promise<{ success: boolean; data: ErrorReport }> => {
    const res = await api.get(`/errors/${id}`);
    return res.data;
  },
  
  update: async (id: string, data: Partial<ErrorReport>): Promise<{ success: boolean; data: ErrorReport }> => {
    const res = await api.patch(`/errors/${id}`, data);
    return res.data;
  },
  
  getAnalytics: async (): Promise<{ success: boolean; data: ErrorAnalytics }> => {
    const res = await api.get('/errors/analytics');
    return res.data;
  },
};
