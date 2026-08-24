import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLeaderboard,
  listBadges,
  getAdminUserProfile,
  adjustXP,
  setStreak,
  awardBadge,
  createBadge,
  deleteBadge,
  type LeaderboardEntry,
  type BadgeDefinition,
} from "@/api/gamification";
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
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, Shield, Activity, Medal, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { TableSkeleton } from "@/components/ui/loading-skeletons";
import { ErrorState } from "@/components/ui/error-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── Constants ───────────────────────────────────────────────────────────────

const RANK_TIERS: Record<string, { label: string; className: string }> = {
  ASPIRANT: { label: "Aspirant", className: "text-muted-foreground bg-muted" },
  CONSTABLE: { label: "Constable", className: "text-[var(--info-text-on-tint)] bg-info/15" },
  SUB_INSPECTOR: { label: "Sub-Inspector", className: "text-subject-quant bg-subject-quant/15" },
  INSPECTOR: { label: "Inspector", className: "text-[var(--warning-text-on-tint)] bg-warning/15" },
  COMMISSIONER: { label: "Commissioner", className: "text-success bg-success/15" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function GamificationPage() {
  const [activeTab, setActiveTab] = useState<"leaderboard" | "badges">("leaderboard");
  
  // Leaderboard State
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const limit = 50;

  // Drawer State
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);

  // Queries
  const { data: leaderboardData, isLoading: isLoadingLeaderboard, isError: isErrorLeaderboard, refetch: refetchLeaderboard } = useQuery({
    queryKey: ["gamification", "leaderboard", page],
    queryFn: () => getLeaderboard(limit, page * limit),
  });

  const { data: badgesData, isLoading: isLoadingBadges } = useQuery({
    queryKey: ["gamification", "badges"],
    queryFn: listBadges,
  });

  // Filter leaderboard by search query (client-side for now within the fetched page)
  const filteredLeaderboard = (leaderboardData?.students ?? []).filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gamification Engine</h2>
          <p className="text-muted-foreground mt-1">
            Manage XP, rank tiers, streaks, and badges across the platform.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border">
        <button
          className={`pb-2 text-sm font-medium transition-colors ${
            activeTab === "leaderboard"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("leaderboard")}
        >
          Leaderboard
        </button>
        <button
          className={`pb-2 text-sm font-medium transition-colors ${
            activeTab === "badges"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("badges")}
        >
          Badges Definitions
        </button>
      </div>

      {/* Content */}
      {activeTab === "leaderboard" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Input
                placeholder="Search leaderboard by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isErrorLeaderboard ? (
            <ErrorState title="Failed to load leaderboard" onRetry={() => refetchLeaderboard()} />
          ) : isLoadingLeaderboard ? (
            <TableSkeleton />
          ) : filteredLeaderboard.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-xl">
              No students found.
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden surface-elevated">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead className="text-right">XP Total</TableHead>
                    <TableHead className="text-right">Streak</TableHead>
                    <TableHead className="text-right">Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaderboard.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className="table-row-interactive cursor-pointer"
                      onClick={() => setSelectedUser(user)}
                    >
                      <TableCell className="font-medium">
                        #{page * limit + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-sm">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`badge-status ${RANK_TIERS[user.rankTier]?.className}`}>
                          {RANK_TIERS[user.rankTier]?.label || user.rankTier}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium text-subject-quant">
                        {user.xpPoints.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5 text-[var(--warning-text-on-tint)]">
                          <Activity className="w-3.5 h-3.5" />
                          <span className="font-medium">{user.streakDays}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {user.lastActiveDate
                          ? formatDistanceToNow(new Date(user.lastActiveDate), { addSuffix: true })
                          : "Never"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {leaderboardData && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {page * limit + 1} to {Math.min((page + 1) * limit, leaderboardData.total)} of {leaderboardData.total} students
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={(page + 1) * limit >= leaderboardData.total}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "badges" && (
        <BadgesTab badges={badgesData ?? []} isLoading={isLoadingBadges} />
      )}

      <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selectedUser && (
            <UserGamificationDrawer
              userId={selectedUser.id}
              badges={badgesData ?? []}
              onClose={() => setSelectedUser(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─── Drawer Component ─────────────────────────────────────────────────────────

function UserGamificationDrawer({
  userId,
  badges,
}: {
  userId: string;
  badges: BadgeDefinition[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["gamification", "user", userId],
    queryFn: () => getAdminUserProfile(userId),
  });

  // Adjust XP Form State
  const [xpDelta, setXpDelta] = useState("");
  const [xpReason, setXpReason] = useState("");

  const adjustXPMutation = useMutation({
    mutationFn: () => adjustXP(userId, { delta: parseInt(xpDelta, 10), reason: xpReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
      toast.success("XP adjusted successfully");
      setXpDelta("");
      setXpReason("");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to adjust XP"),
  });

  // Set Streak Form State
  const [streakDays, setStreakDays] = useState("");

  const setStreakMutation = useMutation({
    mutationFn: () => setStreak(userId, { days: parseInt(streakDays, 10) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
      toast.success("Streak updated");
      setStreakDays("");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to set streak"),
  });

  // Award Badge Form State
  const [selectedBadgeId, setSelectedBadgeId] = useState("");

  const awardBadgeMutation = useMutation({
    mutationFn: () => awardBadge(userId, { badgeId: selectedBadgeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
      toast.success("Badge awarded");
      setSelectedBadgeId("");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to award badge"),
  });

  if (isLoading || !profile) return <div className="p-6">Loading profile...</div>;

  return (
    <>
      <SheetHeader className="mb-6">
        <SheetTitle>{profile.name}</SheetTitle>
        <SheetDescription>{profile.email}</SheetDescription>
      </SheetHeader>

      <div className="space-y-8 pb-8">
        {/* Profile Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total XP</p>
            <p className="text-2xl font-bold font-mono text-subject-quant">{profile.xpPoints.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-sm font-medium text-muted-foreground mb-1">Rank Tier</p>
            <span className={`badge-status mt-1 ${RANK_TIERS[profile.rankTier]?.className}`}>
              {RANK_TIERS[profile.rankTier]?.label}
            </span>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card col-span-2 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Current Streak</p>
              <div className="flex items-center gap-1.5 text-[var(--warning-text-on-tint)]">
                <Activity className="w-4 h-4" />
                <span className="text-xl font-bold">{profile.streakDays} Days</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Last Active</p>
              <p className="text-sm font-medium text-foreground">
                {profile.lastActiveDate ? formatDistanceToNow(new Date(profile.lastActiveDate), { addSuffix: true }) : "Never"}
              </p>
            </div>
          </div>
        </div>

        {/* Adjust XP */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Trophy className="w-4 h-4 text-subject-quant" />
            Adjust XP
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <Label className="text-xs text-muted-foreground mb-1.5 block">Delta (+/-)</Label>
                <Input
                  type="number"
                  placeholder="e.g. -500"
                  value={xpDelta}
                  onChange={(e) => setXpDelta(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-muted-foreground mb-1.5 block">Reason (Audit)</Label>
                <Input
                  placeholder="e.g. Grade dispute correction"
                  value={xpReason}
                  onChange={(e) => setXpReason(e.target.value)}
                />
              </div>
            </div>
            <Button
              className="w-full"
              disabled={!xpDelta || !xpReason || adjustXPMutation.isPending}
              onClick={() => adjustXPMutation.mutate()}
            >
              {adjustXPMutation.isPending ? "Adjusting..." : "Apply XP Adjustment"}
            </Button>
          </div>
        </div>

        {/* Adjust Streak */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--warning-text-on-tint)]" />
            Override Streak
          </h4>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground mb-1.5 block">New Streak Days</Label>
              <Input
                type="number"
                min="0"
                placeholder="e.g. 5"
                value={streakDays}
                onChange={(e) => setStreakDays(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              disabled={!streakDays || setStreakMutation.isPending}
              onClick={() => setStreakMutation.mutate()}
            >
              Set Streak
            </Button>
          </div>
        </div>

        {/* Award Badge */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Medal className="w-4 h-4 text-info" />
            Award Badge
          </h4>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground mb-1.5 block">Select Badge</Label>
              <Select value={selectedBadgeId} onValueChange={setSelectedBadgeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a badge..." />
                </SelectTrigger>
                <SelectContent>
                  {badges.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              disabled={!selectedBadgeId || awardBadgeMutation.isPending}
              onClick={() => awardBadgeMutation.mutate()}
            >
              Award
            </Button>
          </div>

          {/* User's Badges */}
          {profile.badges.length > 0 && (
            <div className="mt-4 border border-border rounded-xl p-3 bg-muted/20">
              <Label className="text-xs text-muted-foreground mb-2 block">Earned Badges</Label>
              <div className="flex flex-wrap gap-2">
                {profile.badges.map((ub) => (
                  <Badge key={ub.id} variant="secondary" className="flex items-center gap-1.5 py-1">
                    <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{ub.badge.name}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Badges Tab ───────────────────────────────────────────────────────────────

function BadgesTab({ badges, isLoading }: { badges: BadgeDefinition[]; isLoading: boolean }) {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newBadge, setNewBadge] = useState({ name: "", description: "", criteria: "", iconUrl: "" });

  const createMutation = useMutation({
    mutationFn: () => createBadge(newBadge),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamification", "badges"] });
      toast.success("Badge created");
      setIsCreateOpen(false);
      setNewBadge({ name: "", description: "", criteria: "", iconUrl: "" });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to create badge"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBadge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamification", "badges"] });
      toast.success("Badge deleted");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to delete badge"),
  });

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Available Badges</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> Create Badge
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Badge</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={newBadge.name} onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })} placeholder="e.g. Early Bird" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={newBadge.description} onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })} placeholder="e.g. Completed the daily quiz before 8 AM" />
              </div>
              <div className="space-y-2">
                <Label>Criteria Key (Slug)</Label>
                <Input value={newBadge.criteria} onChange={(e) => setNewBadge({ ...newBadge, criteria: e.target.value })} placeholder="e.g. daily_early_bird" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={() => createMutation.mutate()} disabled={!newBadge.name || !newBadge.criteria || createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {badges.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-xl">
          No badges defined yet.
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden surface-elevated">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Badge</TableHead>
                <TableHead>Criteria Slug</TableHead>
                <TableHead className="text-right">Students Earned</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {badges.map((badge) => (
                <TableRow key={badge.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{badge.name}</span>
                        <span className="text-xs text-muted-foreground">{badge.description}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      {badge.criteria}
                    </code>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {badge._count.userBadges.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this badge? This removes it from all students who earned it.")) {
                          deleteMutation.mutate(badge.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
