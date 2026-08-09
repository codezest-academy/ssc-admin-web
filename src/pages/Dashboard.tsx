import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/api/analytics";
import {
  Users,
  FileQuestion,
  GraduationCap,
  Activity,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8 text-center text-destructive bg-destructive/10 rounded-xl border border-destructive/20">
        Failed to load dashboard data. Ensure the API is running and you have
        sufficient permissions.
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
          <div key={stat.label} className="surface-glass rounded-xl p-5">
            <div className="flex justify-between items-start">
              <p className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </p>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-3xl font-semibold mt-2 tracking-tight">
              {stat.value.toLocaleString()}
            </p>
            {/* Trend placeholder - to be wired to real data next */}
            <p className="text-xs mt-1 font-medium text-success">
              ↑ 12% vs last week
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
              <div className="p-8 text-center text-muted-foreground text-sm">
                No recent activity.
              </div>
            ) : (
              <div className="divide-y">
                {recentAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">
                          {attempt.student.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 bg-background"
                        >
                          {attempt.attemptType}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {attempt.student.email}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {attempt.status === "SUBMITTED" ? (
                        <>
                          <Badge
                            variant="default"
                            className="bg-success/10 text-success hover:bg-success/20 border-none text-[10px] h-5"
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
                            className="text-[10px] h-5"
                          >
                            In Progress
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Started{" "}
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
              className="text-xs font-medium text-primary hover:underline flex items-center"
            >
              View all <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
          <div className="p-0 flex-1">
            {recentSignups.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No recent signups.
              </div>
            ) : (
              <div className="divide-y">
                {recentSignups.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm uppercase shrink-0">
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
                    <div className="ml-auto text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                      })}
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
