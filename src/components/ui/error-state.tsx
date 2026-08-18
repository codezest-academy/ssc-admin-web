import * as React from "react"
import { ServerCrash, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title?: string
  description?: string
  onRetry?: () => void
  fullPage?: boolean
  errorCode?: string | number
  customActions?: React.ReactNode
  variant?: "destructive" | "warning" | "default"
}

export function ErrorState({
  icon: Icon = ServerCrash,
  title = "Something went wrong",
  description = "Please check your connection and try again.",
  onRetry,
  fullPage,
  errorCode,
  customActions,
  variant = "destructive",
  className,
  ...props
}: ErrorStateProps) {
  
  const variantStyles = {
    destructive: "border-destructive/20 bg-destructive/5 text-destructive",
    warning: "border-warning/20 bg-warning/5 text-warning",
    default: "border-border bg-muted/5 text-foreground",
  }

  const iconBgStyles = {
    destructive: "bg-destructive/10 text-destructive",
    warning: "bg-warning/10 text-warning-text-on-tint",
    default: "bg-muted text-muted-foreground",
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-xl border border-t-4 p-8 text-center shadow-sm",
        fullPage ? "min-h-[60vh]" : "min-h-[300px]",
        variant === "destructive" && "border-t-destructive",
        variant === "warning" && "border-t-warning",
        variant === "default" && "border-t-muted-foreground",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="mb-6 flex flex-col items-center gap-3">
        <div className={cn("flex h-16 w-16 items-center justify-center rounded-full", iconBgStyles[variant])}>
          <Icon className="h-8 w-8" strokeWidth={1.5} />
        </div>
        {errorCode && (
          <span className="rounded-full bg-background/50 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase border border-border">
            {errorCode}
          </span>
        )}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant={variant === "default" ? "outline" : variant === "warning" ? "secondary" : variant}
          >
            Try Again
          </Button>
        )}
        {customActions}
      </div>
    </div>
  )
}
