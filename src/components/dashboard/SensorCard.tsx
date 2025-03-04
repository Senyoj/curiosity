
import { useEffect, useState } from "react";
import { Thermometer, Droplet, FlaskConical } from "lucide-react";
import { DataCard } from "../ui/DataCard";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  type: "temperature" | "turbidity" | "ph";
  value?: number;
  minValue?: number;
  maxValue?: number;
  unit?: string;
  className?: string;
}

export function SensorCard({
  type,
  value,
  minValue,
  maxValue,
  unit = "",
  className,
}: SensorCardProps) {
  const [animatedValue, setAnimatedValue] = useState(value || 0);
  const [status, setStatus] = useState<"normal" | "warning" | "critical">("normal");
  
  useEffect(() => {
    if (value !== undefined) {
      // Smoothly animate the value change
      const start = animatedValue;
      const end = value;
      const duration = 1000; // 1 second duration
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentValue = start + (end - start) * progress;
        
        setAnimatedValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [value]);
  
  useEffect(() => {
    // Determine status based on value ranges
    if (value !== undefined && minValue !== undefined && maxValue !== undefined) {
      const range = maxValue - minValue;
      const warningThreshold = range * 0.2;
      const criticalThreshold = range * 0.1;
      
      if (
        value <= minValue + criticalThreshold ||
        value >= maxValue - criticalThreshold
      ) {
        setStatus("critical");
      } else if (
        value <= minValue + warningThreshold ||
        value >= maxValue - warningThreshold
      ) {
        setStatus("warning");
      } else {
        setStatus("normal");
      }
    }
  }, [value, minValue, maxValue]);
  
  const getIcon = () => {
    switch (type) {
      case "temperature":
        return <Thermometer size={18} />;
      case "turbidity":
        return <Droplet size={18} />;
      case "ph":
        return <FlaskConical size={18} />;
      default:
        return null;
    }
  };
  
  const getTitle = () => {
    switch (type) {
      case "temperature":
        return "Temperature";
      case "turbidity":
        return "Turbidity";
      case "ph":
        return "pH Level";
      default:
        return "";
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case "critical":
        return "text-destructive";
      case "warning":
        return "text-amber-500";
      case "normal":
        return "text-green-500";
      default:
        return "";
    }
  };
  
  const formatValue = (val: number) => {
    if (type === "ph") {
      return val.toFixed(1);
    }
    if (type === "temperature") {
      return val.toFixed(1);
    }
    return val.toFixed(2);
  };
  
  return (
    <DataCard
      title={getTitle()}
      icon={getIcon()}
      className={cn("", className)}
    >
      <div className="flex flex-col items-center gap-2">
        <div className={cn("text-4xl font-light transition-colors", getStatusColor())}>
          {formatValue(animatedValue)}
          <span className="text-lg ml-1">{unit}</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-1 mt-1">
          <div
            className={cn(
              "h-1 rounded-full transition-all",
              status === "normal" && "bg-green-500",
              status === "warning" && "bg-amber-500",
              status === "critical" && "bg-destructive"
            )}
            style={{
              width: `${
                minValue !== undefined && maxValue !== undefined
                  ? ((animatedValue - minValue) / (maxValue - minValue)) * 100
                  : 0
              }%`,
            }}
          />
        </div>
        {minValue !== undefined && maxValue !== undefined && (
          <div className="w-full flex justify-between text-xs text-muted-foreground mt-1">
            <span>{minValue}</span>
            <span>{maxValue}</span>
          </div>
        )}
      </div>
    </DataCard>
  );
}
