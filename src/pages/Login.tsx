import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/axios";
import { ShieldCheck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, setAuth } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      // Depending on the exact API response shape (Assuming it returns token and user info)
      const { token, user } = response.data.data;
      
      if (user.role !== "SUPER_ADMIN" && user.role !== "CONTENT_CREATOR") {
        setError("Unauthorized access. Admin privileges required.");
        return;
      }

      setAuth(user, token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* Left side: Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-50 dark:bg-slate-900/50 p-12 text-foreground border-r border-border/50">
        {/* Top left Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">Code Zest Academy</span>
        </div>

        {/* Bottom left Text */}
        <div className="max-w-md mt-auto">
          <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight">
            Powering the future of <span className="text-primary">SSC education.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-medium">
            A comprehensive command center designed for speed, clarity, and reliability.
          </p>
        </div>
      </div>

      {/* Right side: Form (Dark Mode / Theme Aware) */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo (visible only on small screens) */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Code Zest Academy</span>
          </div>

          <div className="bg-card text-card-foreground border rounded-2xl p-8 sm:p-10 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Log In</h2>
              <p className="text-sm text-muted-foreground mt-2">Sign in to your admin account to continue</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@codezest.com"
                  required
                  className="h-12 bg-background/50 border-input"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Password</Label>
                  <a href="#" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-background/50 border-input"
                  disabled={isLoading}
                />
              </div>
              
              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}
              
              <Button type="submit" className="w-full h-12 text-base font-bold rounded-lg" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
