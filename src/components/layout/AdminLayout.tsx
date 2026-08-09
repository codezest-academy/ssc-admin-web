import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Search, Bell, Settings, User as UserIcon, LogOut } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AdminLayout() {
  const { isAuthenticated, user, logout } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="bg-mesh text-foreground min-h-screen">
        <SidebarProvider className="app-shell-floating bg-transparent w-full">
          <AppSidebar />
          
          <div className="flex flex-col flex-1 gap-3 min-w-0">
            {/* Floating Navbar */}
            <header className="navbar-floating flex items-center justify-between px-5 h-14 flex-shrink-0">
              <SidebarTrigger className="-ml-2 mr-2 text-muted-foreground" />
              
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
                        <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                          {user?.name?.[0]?.toUpperCase() ?? "A"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link to="/profile" className="w-full flex items-center">
                        <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link to="/profile" className="w-full flex items-center">
                        <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                        Settings
                      </Link>
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

            {/* Floating Content Panel */}
            <div className="content-floating">
              <main className="p-6">
                <Outlet />
              </main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  );
}
