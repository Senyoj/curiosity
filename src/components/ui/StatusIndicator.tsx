
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface StatusIndicatorProps {
  className?: string;
}

export function StatusIndicator({ className }: StatusIndicatorProps) {
  const [status, setStatus] = useState<"connected" | "disconnected" | "reconnecting">("disconnected");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("connected");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div 
        className={cn(
          "h-2 w-2 rounded-full animate-pulse-subtle",
          status === "connected" && "bg-green-500",
          status === "disconnected" && "bg-red-500",
          status === "reconnecting" && "bg-amber-500"
        )}
      />
      <span className="text-xs font-medium text-muted-foreground capitalize">
        {status}
      </span>
    </div>
  );
}
