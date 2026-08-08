import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  updateUserRole,
  toggleUserStatus,
  type Role,
  type StudyPersona,
} from "@/api/users";

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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Loader2,
  MoreHorizontal,
  ShieldCheck,
  UserX,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PERSONA_LABELS: Record<StudyPersona, { label: string; className: string }> = {
  FULL_TIME_ASPIRANT: { label: "Full-Time", className: "text-info bg-info/10" },
  PART_TIME_ASPIRANT: { label: "Part-Time", className: "text-warning bg-warning/10" },
  REPEAT_ASPIRANT: { label: "Repeat", className: "text-subject-quant bg-subject-quant/10" },
};

const TIER_CLASSES: Record<string, string> = {
  FREE: "text-muted-foreground bg-muted",
  PRO: "text-success bg-success/10",
  ELITE: "text-warning bg-warning/10",
};

const ROLE_CLASSES: Record<string, string> = {
  SUPER_ADMIN: "text-destructive bg-destructive/10",
  ADMIN: "text-warning bg-warning/10",
  STAFF: "text-info bg-info/10",
  STUDENT: "text-muted-foreground bg-muted",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const rolesMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) =>
      updateUserRole(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User role updated");
    },
    onError: () => toast.error("Failed to update role"),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User status updated");
    },
    onError: () => toast.error("Failed to toggle status"),
  });

  const filtered = (users ?? []).filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground mt-1">
            Manage student accounts, roles, and persona insights.
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {users?.length ?? 0} total
        </Badge>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-xl">
          {searchQuery ? "No users match your search." : "No users yet."}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Persona</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Onboarded</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow
                  key={user.id}
                  className={!user.isActive ? "opacity-50" : undefined}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground text-sm">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${ROLE_CLASSES[user.role] ?? "text-muted-foreground bg-muted"}`}>
                      {user.role.replace("_", " ")}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${TIER_CLASSES[user.subscriptionTier] ?? ""}`}>
                      {user.subscriptionTier}
                    </span>
                  </TableCell>

                  <TableCell>
                    {user.studyPersona ? (
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${PERSONA_LABELS[user.studyPersona]?.className ?? ""}`}>
                        {PERSONA_LABELS[user.studyPersona]?.label}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        {user.onboardingComplete ? "—" : "Not onboarded"}
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {user.targetExam?.replace(/_/g, " ") ?? "—"}
                    </span>
                  </TableCell>

                  <TableCell>
                    {user.onboardingComplete ? (
                      <Badge variant="outline" className="text-success border-success/20 bg-success/5 text-xs">
                        ✓ Done
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-xs">
                        Pending
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => rolesMutation.mutate({ id: user.id, role: "ADMIN" })}
                          disabled={user.role === "ADMIN" || user.role === "SUPER_ADMIN"}
                        >
                          <ShieldCheck className="w-4 h-4 mr-2" />
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => rolesMutation.mutate({ id: user.id, role: "STAFF" })}
                          disabled={user.role === "STAFF"}
                        >
                          <ShieldCheck className="w-4 h-4 mr-2" />
                          Make Staff
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => rolesMutation.mutate({ id: user.id, role: "STUDENT" })}
                          disabled={user.role === "STUDENT"}
                        >
                          Make Student
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className={user.isActive ? "text-destructive focus:text-destructive" : ""}
                          onClick={() => toggleMutation.mutate(user.id)}
                          disabled={user.role === "SUPER_ADMIN"}
                        >
                          {user.isActive ? (
                            <><UserX className="w-4 h-4 mr-2" /> Deactivate</>
                          ) : (
                            <><UserCheck className="w-4 h-4 mr-2" /> Reactivate</>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
