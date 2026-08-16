import { api } from "@/lib/axios";

export interface HealthMetrics {
  status: string;
  timestamp: string;
  uptimeSeconds: number;
  system: {
    platform: string;
    arch: string;
    cpuCount: number;
    loadAverage: number[];
    totalMemoryBytes: number;
    freeMemoryBytes: number;
    usedMemoryBytes: number;
    memoryUsagePercent: string;
  };
  process: {
    rssBytes: number;
    heapTotalBytes: number;
    heapUsedBytes: number;
    externalBytes: number;
  };
  services: {
    database: string;
    redis: string;
  };
  latency: {
    totalRequests: number;
    averageLatencyMs: number;
    recentAverageLatencyMs: number;
  };
}

export const healthApi = {
  getMetrics: async (): Promise<HealthMetrics> => {
    const res = await api.get("/health/metrics");
    return res.data.data;
  },
};
