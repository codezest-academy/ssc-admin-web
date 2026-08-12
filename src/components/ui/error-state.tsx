import * as React from "react"
import { ServerCrash, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title?: string
  description?: string
  onRetry?: () => void
  fullPage?: boolean
}

export function ErrorState({
  icon: Icon = ServerCrash,
  title = "Something went wrong",
  description = "Please check your connection and try again.",
  onRetry,
  fullPage,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center",
        fullPage ? "min-h-[60vh]" : "min-h-[300px]",
        className
      )}
      {...props}
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <Icon className="h-8 w-8 text-destructive" strokeWidth={1.5} />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground line-clamp-2">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
