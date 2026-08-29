import { useQuery } from "@tanstack/react-query";
import { healthApi } from "@/api/health";
import { 
  Activity, 
  Database, 
  
  Clock, 
  Cpu, 
  MemoryStick, 
  Wifi,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/ui/error-state";


export default function SystemHealthPage() {
  const { data: metrics, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["healthMetrics"],
    queryFn: healthApi.getMetrics,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  if (isError) {
    return (
      <div className="p-8">
        <ErrorState title="Failed to load system metrics" onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading && !metrics) {
    return <div className="p-8">Loading system health metrics...</div>;
  }

  if (!metrics) {
    return <div className="p-8 text-destructive">Failed to load metrics.</div>;
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    return `${d}d ${h}h ${m}m`;
  };

  const memPercent = parseFloat(metrics.system.memoryUsagePercent);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground mt-2">
            Real-time monitoring for backend infrastructure and APIs.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUptime(metrics.uptimeSeconds)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Since last deployment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Latency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.latency.recentAverageLatencyMs} ms</div>
            <p className="text-xs text-muted-foreground mt-1">
              Rolling average (last 100 reqs)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{metrics.services.database}</div>
            <div className="mt-2">
              <Badge variant={metrics.services.database === 'connected' ? 'default' : 'destructive'} className={metrics.services.database === 'connected' ? 'bg-success/10 text-success hover:bg-success/20' : ''}>
                {metrics.services.database === 'connected' ? 'Healthy' : 'Critical'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redis Cache</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{metrics.services.redis}</div>
            <div className="mt-2">
              <Badge variant={metrics.services.redis === 'connected' ? 'default' : 'destructive'} className={metrics.services.redis === 'connected' ? 'bg-success/10 text-success hover:bg-success/20' : ''}>
                {metrics.services.redis === 'connected' ? 'Healthy' : 'Critical'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              CPU Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Load Average (1m)</span>
                <span className="font-medium">{metrics.system.loadAverage[0].toFixed(2)}</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${Math.min((metrics.system.loadAverage[0] / metrics.system.cpuCount) * 100, 100)}%` }}></div></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Load Average (5m)</span>
                <span className="font-medium">{metrics.system.loadAverage[1].toFixed(2)}</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${Math.min((metrics.system.loadAverage[1] / metrics.system.cpuCount) * 100, 100)}%` }}></div></div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Logical Cores</p>
                <p className="text-xl font-bold">{metrics.system.cpuCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Platform</p>
                <p className="text-xl font-bold capitalize">{metrics.system.platform} {metrics.system.arch}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MemoryStick className="w-5 h-5" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">System Memory</span>
                <span className="font-medium">{memPercent}%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden"><div className={`h-full ${memPercent > 85 ? 'bg-destructive' : memPercent > 70 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${memPercent}%` }}></div></div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatBytes(metrics.system.usedMemoryBytes)} used</span>
                <span>{formatBytes(metrics.system.totalMemoryBytes)} total</span>
              </div>
            </div>

            <div className="pt-4 border-t space-y-4">
              <h4 className="text-sm font-medium">Node.js Process</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">RSS</p>
                  <p className="text-sm font-semibold">{formatBytes(metrics.process.rssBytes)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Heap Used / Total</p>
                  <p className="text-sm font-semibold">
                    {formatBytes(metrics.process.heapUsedBytes)} / {formatBytes(metrics.process.heapTotalBytes)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
