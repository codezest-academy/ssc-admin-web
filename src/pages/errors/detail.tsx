import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorState } from "@/components/ui/error-state";
import { errorsApi } from "@/api/errors";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function ErrorDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["error", id],
    queryFn: () => errorsApi.getById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: { status?: any; notes?: string }) => errorsApi.update(id!, updates),
    onSuccess: () => {
      toast.success("Error report updated");
      queryClient.invalidateQueries({ queryKey: ["error", id] });
      queryClient.invalidateQueries({ queryKey: ["errors"] });
    },
    onError: () => toast.error("Failed to update error report"),
  });

  if (isError) {
    return (
      <div className="p-8">
        <ErrorState title="Failed to load details" onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!data?.data) return <div className="p-8">Error report not found.</div>;

  const err = data.data;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link to="/errors">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Error Details
            <Badge variant={err.severity === 'CRITICAL' ? 'destructive' : err.severity === 'HIGH' ? 'destructive' : 'secondary'}>
              {err.severity}
            </Badge>
            <Badge variant="outline">{err.status}</Badge>
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">{err.fingerprint}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-md font-mono text-sm text-foreground overflow-x-auto whitespace-pre-wrap">
                {err.message}
              </div>
            </CardContent>
          </Card>

          {(err.stack || err.componentStack) && (
            <Card>
              <CardHeader>
                <CardTitle>Stack Trace</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-md font-mono text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap max-h-[500px]">
                  {err.stack || err.componentStack}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Occurrences</div>
                <div className="text-lg font-semibold">{err.occurrenceCount} times</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Affected Users</div>
                <div className="text-lg font-semibold">{err.affectedUserCount} users</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">First Seen</div>
                <div className="text-sm">{new Date(err.firstSeenAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Last Seen</div>
                <div className="text-sm">{new Date(err.lastSeenAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Route Path</div>
                <div className="text-sm font-mono break-all">{err.routePath || err.url}</div>
              </div>
              {err.userAgent && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">User Agent</div>
                  <div className="text-xs text-muted-foreground break-words">{err.userAgent}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select 
                  value={err.status} 
                  onValueChange={(val) => updateMutation.mutate({ status: val })}
                  disabled={updateMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNRESOLVED">Unresolved</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="IGNORED">Ignored</SelectItem>
                    <SelectItem value="REGRESSED" disabled>Regressed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea 
                  placeholder="Resolution notes..."
                  value={notes || err.notes || ""}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
                <Button 
                  className="w-full" 
                  disabled={updateMutation.isPending || notes === (err.notes || "")}
                  onClick={() => updateMutation.mutate({ notes })}
                >
                  Save Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
