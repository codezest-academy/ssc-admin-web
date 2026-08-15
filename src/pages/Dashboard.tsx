import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/api/analytics";
import {
  Users,
  FileQuestion,
  GraduationCap,
  Activity,
  ArrowUpRight,
  WifiOff,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-full w-full pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Welcome to the SSC Admin Portal. Here is the real-time platform overview.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="surface-glass rounded-xl p-5 border border-border/50 shadow-sm">
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-24 bg-muted/60" />
              <Skeleton className="h-4 w-4 bg-muted/60" />
            </div>
            <Skeleton className="h-8 w-16 mt-3 bg-muted/60" />
            <Skeleton className="h-3 w-20 mt-2 bg-muted/60" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b bg-muted/20">
            <Skeleton className="h-6 w-40 bg-muted/60" />
            <Skeleton className="h-4 w-56 mt-1 bg-muted/60" />
          </div>
          <div className="p-4 flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32 bg-muted/60" />
                  <Skeleton className="h-3 w-40 bg-muted/60" />
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Skeleton className="h-5 w-16 rounded-full bg-muted/60" />
                  <Skeleton className="h-3 w-24 bg-muted/60" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b bg-muted/20">
            <Skeleton className="h-6 w-32 bg-muted/60" />
            <Skeleton className="h-4 w-48 mt-1 bg-muted/60" />
          </div>
          <div className="p-4 flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full bg-muted/60" />
                <div className="flex flex-col gap-2 flex-1">
                  <Skeleton className="h-4 w-28 bg-muted/60" />
                  <Skeleton className="h-3 w-40 bg-muted/60" />
                </div>
                <Skeleton className="h-3 w-16 bg-muted/60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboard,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <ErrorState
          icon={WifiOff}
          title="Connection Error"
          description="Failed to load dashboard data. Ensure the API is running and you have sufficient permissions."
          variant="destructive"
          errorCode="API_UNREACHABLE"
          onRetry={refetch}
          className="max-w-md shadow-lg"
        />
      </div>
    );
  }

  const { metrics, recentSignups, recentAttempts } = data;

  const statCards = [
    {
      label: "Total Students",
      value: metrics.totalStudents,
      icon: Users,
      color: "text-subject-english-text-on-tint",
      bg: "bg-subject-english/10",
    },
    {
      label: "Active Exams",
      value: metrics.activeExams,
      icon: GraduationCap,
      color: "text-subject-reason-text-on-tint",
      bg: "bg-subject-reason/10",
    },
    {
      label: "Questions Bank",
      value: metrics.totalQuestions,
      icon: FileQuestion,
      color: "text-warning-text-on-tint",
      bg: "bg-warning/10",
    },
    {
      label: "Total Test Attempts",
      value: metrics.totalAttempts,
      icon: Activity,
      color: "text-subject-ga-text-on-tint",
      bg: "bg-subject-ga/10",
    },
  ];

  return (
    <div className="space-y-6 max-w-full w-full pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Welcome to the SSC Admin Portal. Here is the real-time platform
          overview.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="surface-glass rounded-xl p-5 shadow-sm border border-border/40">
            <div className="flex justify-between items-start">
              <p className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </p>
              <div className={`p-1.5 rounded-md ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-semibold mt-3 tracking-tight">
              {stat.value.toLocaleString()}
            </p>
            {/* Trend placeholder - to be wired to real data next */}
            <p className="text-xs mt-2 font-medium text-success flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> 12% vs last week
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Attempts (Larger Table) */}
        <div className="lg:col-span-4 rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b bg-muted/20 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Recent Test Activity</h3>
              <p className="text-sm text-muted-foreground">
                Latest submissions and ongoing tests.
              </p>
            </div>
          </div>
          <div className="p-0 flex-1">
            {recentAttempts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Activity className="h-10 w-10 text-muted-foreground/30 mb-3" strokeWidth={1.5} />
                <p className="text-sm font-medium text-foreground">No recent activity</p>
                <p className="text-xs text-muted-foreground mt-1">There are no recent test attempts to display.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {recentAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">
                          {attempt.student.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 h-5 bg-background font-medium text-muted-foreground"
                        >
                          {attempt.attemptType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {attempt.student.email}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {attempt.status === "SUBMITTED" ? (
                        <>
                          <Badge
                            variant="default"
                            className="bg-success/10 text-success hover:bg-success/20 border-none text-[10px] px-2 h-5"
                          >
                            Submitted
                          </Badge>
                          <span className="text-xs font-semibold text-foreground">
                            {attempt.marksObtained !== null
                              ? `${attempt.marksObtained} Marks`
                              : "Evaluating..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-2 h-5 bg-muted text-muted-foreground border-none"
                          >
                            In Progress
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {formatDistanceToNow(new Date(attempt.startedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Signups */}
        <div className="lg:col-span-3 rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b bg-muted/20 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">New Students</h3>
              <p className="text-sm text-muted-foreground">
                Latest platform registrations.
              </p>
            </div>
            <Link
              to="/users"
              className="text-xs font-medium text-primary hover:underline flex items-center bg-primary/5 px-2 py-1 rounded-md"
            >
              View all <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
          <div className="p-0 flex-1">
            {recentSignups.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Users className="h-10 w-10 text-muted-foreground/30 mb-3" strokeWidth={1.5} />
                <p className="text-sm font-medium text-foreground">No recent signups</p>
                <p className="text-xs text-muted-foreground mt-1">New users will appear here once they register.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {recentSignups.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm uppercase shrink-0 ring-2 ring-primary/5">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-sm text-foreground truncate">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </span>
                    </div>
                    <div className="ml-auto text-[10px] font-medium text-muted-foreground shrink-0 whitespace-nowrap bg-muted/50 px-2 py-1 rounded-md">
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                      }).replace('about ', '')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
