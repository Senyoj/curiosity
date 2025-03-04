
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { SensorCard } from "@/components/dashboard/SensorCard";
import { SensorChart } from "@/components/dashboard/SensorChart";
import { websocketService } from "@/lib/websocket";
import { generateTimeSeriesData, getSensorConfig } from "@/lib/mockData";
import { Clock, RefreshCw } from "lucide-react";

interface SensorData {
  temperature: number;
  turbidity: number;
  ph: number;
  timestamp: number;
}

const Dashboard = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [turbidityHistory, setTurbidityHistory] = useState([]);
  const [phHistory, setPhHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "reconnecting">("disconnected");
  
  useEffect(() => {
    setTemperatureHistory(generateTimeSeriesData("temperature", 20, 30000));
    setTurbidityHistory(generateTimeSeriesData("turbidity", 20, 30000));
    setPhHistory(generateTimeSeriesData("ph", 20, 30000));
    
    // Listen for new sensor data from WebSocket
    const handleData = (data: SensorData) => {
      setSensorData(data);
      setLastUpdated(new Date(data.timestamp));
      setIsLoading(false);
      
      // Update historical data
      setTemperatureHistory((prev) => [
        ...prev,
        { timestamp: data.timestamp, value: data.temperature },
      ].slice(-60)); // Keep the last 60 data points (30 minutes at 30s intervals)
      
      setTurbidityHistory((prev) => [
        ...prev,
        { timestamp: data.timestamp, value: data.turbidity },
      ].slice(-60));
      
      setPhHistory((prev) => [
        ...prev,
        { timestamp: data.timestamp, value: data.ph },
      ].slice(-60));
    };
    
    const handleConnection = (data: { status: "connected" | "disconnected" | "reconnecting" }) => {
      setConnectionStatus(data.status);
      if (data.status === "disconnected") {
        setIsLoading(true);
      }
    };
    
    websocketService.on("data", handleData);
    websocketService.on("connection", handleConnection);
    
    // Simulate initial load
    setTimeout(() => {
      if (!sensorData) {
        setIsLoading(false);
      }
    }, 3000);
    
    return () => {
      websocketService.off("data", handleData);
      websocketService.off("connection", handleConnection);
    };
  }, []);
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate manual refresh
    setTimeout(() => {
      const mockData = {
        temperature: 20 + Math.random() * 10,
        turbidity: Math.random() * 10,
        ph: 6.5 + Math.random() * 2,
        timestamp: Date.now(),
      };
      
      setSensorData(mockData);
      setLastUpdated(new Date(mockData.timestamp));
      setIsLoading(false);
      
      // Update historical data
      setTemperatureHistory((prev) => [
        ...prev,
        { timestamp: mockData.timestamp, value: mockData.temperature },
      ].slice(-60));
      
      setTurbidityHistory((prev) => [
        ...prev,
        { timestamp: mockData.timestamp, value: mockData.turbidity },
      ].slice(-60));
      
      setPhHistory((prev) => [
        ...prev,
        { timestamp: mockData.timestamp, value: mockData.ph },
      ].slice(-60));
    }, 1000);
  };
  
  const temperatureConfig = getSensorConfig("temperature");
  const turbidityConfig = getSensorConfig("turbidity");
  const phConfig = getSensorConfig("ph");
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container pt-24 pb-16 px-4 mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-light">Dashboard</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={14} />
              <span>
                {lastUpdated
                  ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
                  : "Waiting for data..."}
              </span>
              <button
                onClick={handleRefresh}
                disabled={isLoading || connectionStatus !== "connected"}
                className="ml-2 p-1 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
              >
                <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
          
          {/* Sensor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-enter">
            <SensorCard
              type="temperature"
              value={sensorData?.temperature || 0}
              minValue={temperatureConfig.min}
              maxValue={temperatureConfig.max}
              unit={temperatureConfig.unit}
              className="animate-in-delay-100"
            />
            <SensorCard
              type="turbidity"
              value={sensorData?.turbidity || 0}
              minValue={turbidityConfig.min}
              maxValue={turbidityConfig.max}
              unit={turbidityConfig.unit}
              className="animate-in-delay-200"
            />
            <SensorCard
              type="ph"
              value={sensorData?.ph || 0}
              minValue={phConfig.min}
              maxValue={phConfig.max}
              unit={phConfig.unit}
              className="animate-in-delay-300"
            />
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 gap-4 mt-4 animate-enter animate-in-delay-400">
            <SensorChart
              title="Temperature History"
              data={temperatureHistory}
              color={temperatureConfig.color}
              unit={temperatureConfig.unit}
              minValue={temperatureConfig.min}
              maxValue={temperatureConfig.max}
            />
            <SensorChart
              title="Turbidity History"
              data={turbidityHistory}
              color={turbidityConfig.color}
              unit={turbidityConfig.unit}
              minValue={turbidityConfig.min}
              maxValue={turbidityConfig.max}
            />
            <SensorChart
              title="pH History"
              data={phHistory}
              color={phConfig.color}
              unit={phConfig.unit}
              minValue={phConfig.min}
              maxValue={phConfig.max}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
