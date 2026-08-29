import { useQuery } from "@tanstack/react-query";
import { ErrorState } from "@/components/ui/error-state";
import { Link } from "react-router-dom";
import { errorsApi } from "@/api/errors";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertOctagon, Users, Clock, Activity } from "lucide-react";

export default function ErrorAnalytics() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["error-analytics"],
    queryFn: () => errorsApi.getAnalytics(),
  });

  if (isError) {
    return (
      <div className="p-8">
        <ErrorState title="Failed to load analytics" onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading) return <div className="p-8">Loading analytics...</div>;
  if (!data?.data) return <div className="p-8">No analytics data available.</div>;

  const { summary, impactBySeverity, topRoutes } = data.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/errors">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Crash Analytics</h1>
          <p className="text-muted-foreground mt-2">Platform stability and impact metrics.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">System Impact Score</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalImpactScore.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Weighted metric across all issues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Critical Errors (24h)</CardTitle>
            <AlertOctagon className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{summary.totalCriticalLast24h}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Unresolved Issues</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalUnresolved}</div>
            <p className="text-xs text-muted-foreground mt-1">{summary.totalInProgress} currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Resolved Issues</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{summary.totalResolved}</div>
            <p className="text-xs text-muted-foreground mt-1">{summary.totalRegressed} regressions detected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Impact by Severity</CardTitle>
            <CardDescription>Breakdown of issues and affected users by priority</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {impactBySeverity.map((sev) => (
                <div key={sev.severity} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={sev.severity === 'CRITICAL' || sev.severity === 'HIGH' ? 'destructive' : 'secondary'}>
                      {sev.severity}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{sev.count} issues</div>
                    <div className="text-xs text-muted-foreground">{sev.affectedUsers} affected users</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Impacted Routes</CardTitle>
            <CardDescription>Pages with the highest number of crashes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRoutes.map((route, i) => (
                <div key={i} className="flex flex-col gap-1 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="font-mono text-sm font-medium truncate">{route.routePath}</div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{route.occurrences} occurrences</span>
                    <span>{route.affectedUsers} affected users</span>
                  </div>
                </div>
              ))}
              {topRoutes.length === 0 && (
                <div className="text-sm text-muted-foreground">No route data available.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
