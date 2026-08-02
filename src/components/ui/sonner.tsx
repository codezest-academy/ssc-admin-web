import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-success" />,
        info: <InfoIcon className="size-4 text-info" />,
        warning: <TriangleAlertIcon className="size-4 text-warning" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: <Loader2Icon className="size-4 animate-spin text-muted-foreground" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast transition-all bg-background text-foreground border-border shadow-lg",
          title: "text-foreground font-medium",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
          success: "!bg-success/10 !border-success/30 [&_[data-title]]:!text-foreground [&_[data-description]]:!text-muted-foreground",
          error: "!bg-destructive/10 !border-destructive/30 [&_[data-title]]:!text-foreground [&_[data-description]]:!text-muted-foreground",
          warning: "!bg-warning/10 !border-warning/30 [&_[data-title]]:!text-foreground [&_[data-description]]:!text-muted-foreground",
          info: "!bg-info/10 !border-info/30 [&_[data-title]]:!text-foreground [&_[data-description]]:!text-muted-foreground",
          loading: "!bg-muted !text-foreground !border-border",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
