import { useState, useEffect } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  HelpCircle,
  ClipboardList,
  BarChart3,
  LogOut,
  Search,
  Bell,
  Settings,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";

const SIDEBAR_KEY = "ssc-admin-sidebar-collapsed";

const navItems = [
  { name: "Dashboard",     href: "/dashboard",     icon: LayoutDashboard },
  { name: "Users",         href: "/users",         icon: Users },
  { name: "Subjects",      href: "/subjects",      icon: BookOpen },
  { name: "Question Bank", href: "/questions",     icon: HelpCircle },
  { name: "Practice Sets", href: "/practice-sets", icon: ClipboardList },
  { name: "Attempts",      href: "/attempts",      icon: BarChart3 },
];

export default function AdminLayout() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, String(collapsed));
    } catch {
      // ignore storage errors
    }
  }, [collapsed]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "AD";

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-screen bg-background">
        {/* ── Sidebar ──────────────────────────────────────────────── */}
        <aside
          className={`
            hidden md:flex flex-col flex-shrink-0
            bg-sidebar border-r border-sidebar-border
            transition-all duration-300 ease-in-out
            ${collapsed ? "w-16" : "w-64"}
          `}
        >
          {/* Brand */}
          <div className={`h-16 flex items-center flex-shrink-0 px-4 ${collapsed ? "justify-center" : "px-5"}`}>
            {collapsed ? (
              <span className="text-lg font-extrabold text-primary tracking-tight">CZ</span>
            ) : (
              <span className="text-base font-bold text-primary tracking-tight truncate">
                Code Zest Academy
              </span>
            )}
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              const linkClass = `
                flex items-center rounded-md text-sm font-medium transition-colors duration-150
                ${collapsed ? "justify-center px-0 py-2.5 h-10 w-10 mx-auto" : "gap-3 px-3 py-2.5 w-full"}
                ${isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }
              `;

              return collapsed ? (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link to={item.href} className={linkClass}>
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link key={item.name} to={item.href} className={linkClass}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Collapse Toggle */}
          <div className={`p-3 border-t border-sidebar-border flex ${collapsed ? "justify-center" : "justify-end"}`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed((c) => !c)}
              className="h-8 w-8 rounded-md text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>
        </aside>

        {/* ── Main Content Area ─────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-10">
            {/* Search */}
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-sm hidden sm:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search anything..."
                  className="w-full bg-muted/50 shadow-none pl-8 h-9 rounded-full border-border/60"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <ModeToggle />

              <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full hidden sm:flex">
                <Bell className="w-5 h-5" />
                <span className="sr-only">Notifications</span>
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full overflow-hidden p-0 border border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Avatar className="h-full w-full">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user?.name ?? "")}`}
                        alt={user?.name ?? "Admin"}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-semibold leading-none">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-muted/10 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
