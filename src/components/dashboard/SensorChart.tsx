
import { useEffect, useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  TooltipProps 
} from "recharts";
import { DataCard } from "../ui/DataCard";
import { ChevronDown, ChevronUp, BarChart2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DataPoint {
  timestamp: number;
  value: number;
}

interface SensorChartProps {
  title: string;
  data: DataPoint[];
  color?: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
}

export function SensorChart({
  title,
  data,
  color = "hsl(var(--primary))",
  unit = "",
  minValue,
  maxValue,
}: SensorChartProps) {
  const [visible, setVisible] = useState(true);
  const [animatedData, setAnimatedData] = useState<DataPoint[]>([]);
  
  useEffect(() => {
    // Animate data changes
    if (data && data.length) {
      setAnimatedData([]);
      const timer = setTimeout(() => {
        setAnimatedData(data);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [data]);
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as DataPoint;
      const timeAgo = formatDistanceToNow(new Date(dataPoint.timestamp), { addSuffix: true });
      
      return (
        <div className="glass p-2 border border-border/50 text-sm shadow-lg rounded-lg">
          <p className="font-medium">{formatTime(dataPoint.timestamp)} <span className="text-xs text-muted-foreground">({timeAgo})</span></p>
          <p className="text-sm">
            Value: <span className="font-medium" style={{ color }}>
              {dataPoint.value.toFixed(2)} {unit}
            </span>
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <DataCard 
      title={title} 
      icon={<BarChart2 size={18} />}
      className="col-span-full"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-muted-foreground">
          {animatedData.length > 0 ? `${animatedData.length} data points` : "No data"}
        </span>
        <button
          onClick={() => setVisible(!visible)}
          className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
        >
          {visible ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      
      {visible && (
        <div className="h-60 transition-all duration-500 animate-fade-in">
          {animatedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={animatedData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTime} 
                  stroke="hsl(var(--muted-foreground))" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[minValue || 'auto', maxValue || 'auto']} 
                  stroke="hsl(var(--muted-foreground))" 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 1 }}
                  activeDot={{ r: 5, stroke: "hsl(var(--background))" }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      )}
    </DataCard>
  );
}
