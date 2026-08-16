import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  updateUserRole,
  toggleUserStatus,
  type Role,
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
  MoreHorizontal,
  ShieldCheck,
  UserX,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { TableSkeleton } from "@/components/ui/loading-skeletons";

const ROLE_CLASSES: Record<string, string> = {
  SUPER_ADMIN: "text-[var(--destructive-text-on-tint)] bg-destructive/15",
  ADMIN: "text-[var(--warning-text-on-tint)] bg-warning/15",
  STAFF: "text-[var(--subject-ga-text-on-tint)] bg-subject-ga/15",
};

export default function StaffPage() {
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

  const filtered = (users ?? [])
    .filter((u) => u.role !== "STUDENT")
    .filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-full w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Staff</h2>
          <p className="text-muted-foreground mt-1">
            Manage administrative and staff accounts.
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {filtered.length} total
        </Badge>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-xl">
          {searchQuery ? "No staff match your search." : "No staff yet."}
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden surface-elevated">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow
                  key={user.id}
                  className={`table-row-interactive ${!user.isActive ? "opacity-50" : ""}`}
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
                    <span className={`badge-status ${ROLE_CLASSES[user.role] ?? "text-muted-foreground bg-muted"}`}>
                      {user.role.replace("_", " ")}
                    </span>
                  </TableCell>

                  <TableCell>
                     {user.isActive ? (
                        <span className="badge-status text-success border border-success/30 bg-success/15 shadow-sm">Active</span>
                      ) : (
                        <span className="badge-status text-[var(--warning-text-on-tint)] border border-warning/30 bg-warning/15 shadow-sm">Inactive</span>
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
                          disabled={user.role === "STAFF" || user.role === "SUPER_ADMIN"}
                        >
                          <ShieldCheck className="w-4 h-4 mr-2" />
                          Make Staff
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => rolesMutation.mutate({ id: user.id, role: "STUDENT" })}
                          disabled={user.role === "STUDENT" || user.role === "SUPER_ADMIN"}
                        >
                          Make Student (Remove Access)
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
