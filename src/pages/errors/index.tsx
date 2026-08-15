import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { errorsApi } from "@/api/errors";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ErrorsIndex() {
  const [status, setStatus] = useState<string>("UNRESOLVED");

  const { data, isLoading } = useQuery({
    queryKey: ["errors", { status }],
    queryFn: () => errorsApi.list(status !== "ALL" ? { status } : {}),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Crash Reports</h1>
          <p className="text-muted-foreground mt-2">View and manage application crashes and errors.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/errors/analytics">
            <Button variant="outline">View Analytics</Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="UNRESOLVED">Unresolved</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="REGRESSED">Regressed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-0 overflow-hidden border border-border">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading errors...</div>
        ) : !data?.data?.length ? (
          <div className="p-8 text-center text-muted-foreground">No errors found for this status.</div>
        ) : (
          <div className="divide-y divide-border">
            {data.data.map((err: any) => (
              <div key={err.id} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={err.severity === 'CRITICAL' ? 'destructive' : err.severity === 'HIGH' ? 'destructive' : 'secondary'}>
                      {err.severity}
                    </Badge>
                    <span className="font-mono text-sm text-muted-foreground truncate">{err.routePath || err.url}</span>
                  </div>
                  <h3 className="font-semibold text-foreground truncate">{err.message}</h3>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center gap-4">
                    <span>{err.occurrenceCount} occurrences</span>
                    <span>{err.affectedUserCount} users affected</span>
                    <span>Last seen: {new Date(err.lastSeenAt).toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <Link to={`/errors/${err.id}`}>
                    <Button variant="secondary" size="sm">View Details</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
