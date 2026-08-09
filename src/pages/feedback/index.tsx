import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

interface Feedback {
  id: string;
  type: "ISSUE" | "FEATURE_REQUEST" | "TESTIMONIAL";
  message: string;
  questionId: string | null;
  isPublic: boolean;
  status: "OPEN" | "RESOLVED" | "IGNORED";
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

export default function FeedbackPage() {
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState<string>("ALL");

  const { data: feedback = [], isLoading } = useQuery({
    queryKey: ["feedback", filterType],
    queryFn: async () => {
      const params = filterType !== "ALL" ? { type: filterType } : {};
      const res = await api.get<{ data: Feedback[] }>("/feedback", { params });
      return res.data.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Feedback> }) => {
      const res = await api.patch<{ data: Feedback }>(`/feedback/${id}`, updates);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      toast.success("Feedback updated successfully");
    },
    onError: () => {
      toast.error("Failed to update feedback");
    },
  });

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "ISSUE": return "destructive";
      case "FEATURE_REQUEST": return "secondary";
      case "TESTIMONIAL": return "default";
      default: return "outline";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Feedback</h2>
          <p className="text-muted-foreground mt-1">
            Review issues, feature requests, and manage testimonials.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Feedback</SelectItem>
            <SelectItem value="ISSUE">Issues</SelectItem>
            <SelectItem value="FEATURE_REQUEST">Feature Requests</SelectItem>
            <SelectItem value="TESTIMONIAL">Testimonials</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Context</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Public (Testimonial)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  Loading feedback...
                </TableCell>
              </TableRow>
            ) : feedback.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  No feedback found.
                </TableCell>
              </TableRow>
            ) : (
              feedback.map((item: Feedback) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.user.name || "Unknown"}</div>
                    <div className="text-xs text-muted-foreground">{item.user.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(item.type) as any}>{item.type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2 text-sm">{item.message}</p>
                  </TableCell>
                  <TableCell>
                    {item.questionId ? (
                      <span className="text-xs text-muted-foreground font-mono">Q: {item.questionId.slice(0, 8)}...</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(item.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={item.status} 
                      onValueChange={(val) => updateMutation.mutate({ id: item.id, updates: { status: val as any } })}
                    >
                      <SelectTrigger className="h-8 w-[110px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="IGNORED">Ignored</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button
                        variant={item.isPublic ? "default" : "outline"}
                        size="sm"
                        disabled={item.type !== "TESTIMONIAL"}
                        onClick={() => updateMutation.mutate({ id: item.id, updates: { isPublic: !item.isPublic } })}
                      >
                        {item.isPublic ? "Public" : "Private"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
