
import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface DataCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  icon?: ReactNode;
  variant?: "default" | "outline";
  className?: string;
  children: ReactNode;
}

export function DataCard({
  title,
  icon,
  variant = "default",
  className,
  children,
  ...props
}: DataCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden transition-all duration-300 h-full",
        variant === "default" && "card-glass",
        variant === "outline" && "border bg-background/50",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <h3 className="text-sm font-medium flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {title}
        </h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
