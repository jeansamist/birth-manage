import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/60 selection:bg-primary/30",
        "border-border h-12 w-full min-w-0 rounded-xl border bg-background px-4 py-2.5 text-base shadow-sm transition-all outline-none",
        "focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
