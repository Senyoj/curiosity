
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { SensorChart } from "@/components/dashboard/SensorChart";
import { DataCard } from "@/components/ui/DataCard";
import { generateTimeSeriesData, getSensorConfig } from "@/lib/mockData";
import { Download, Calendar, Filter, ChevronDown } from "lucide-react";

interface TimeRangeOption {
  label: string;
  value: string;
  days: number;
}

const timeRangeOptions: TimeRangeOption[] = [
  { label: "Last 24 Hours", value: "1d", days: 1 },
  { label: "Last 7 Days", value: "7d", days: 7 },
  { label: "Last 30 Days", value: "30d", days: 30 },
];

const Historical = () => {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>(timeRangeOptions[0]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [turbidityData, setTurbidityData] = useState([]);
  const [phData, setPhData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
  
  useEffect(() => {
    // Simulate loading historical data based on time range
    setIsLoading(true);
    
    // Calculate interval based on time range (more points = longer interval)
    const intervalMs = timeRange.days * 24 * 60 * 60 * 1000 / 100; 
    
    setTimeout(() => {
      setTemperatureData(generateTimeSeriesData("temperature", 100, intervalMs));
      setTurbidityData(generateTimeSeriesData("turbidity", 100, intervalMs));
      setPhData(generateTimeSeriesData("ph", 100, intervalMs));
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);
  
  const handleTimeRangeChange = (option: TimeRangeOption) => {
    setTimeRange(option);
    setShowTimeRangeDropdown(false);
  };
  
  const handleDownloadData = () => {
    // In a real app, this would generate and download a CSV/JSON file
    alert("Data export functionality would be implemented in a production app.");
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
            <h1 className="text-3xl font-light">Historical Data</h1>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar size={16} />
                <span>View and analyze historical sensor data</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-accent text-sm"
                  >
                    <Filter size={16} />
                    <span>{timeRange.label}</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {showTimeRangeDropdown && (
                    <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-card border border-border z-10 animate-scale-in origin-top-right">
                      <div className="py-1">
                        {timeRangeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleTimeRangeChange(option)}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-accent"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleDownloadData}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                >
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-60">
              <div className="text-muted-foreground">Loading historical data...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 animate-fade-in">
              <SensorChart
                title="Temperature History"
                data={temperatureData}
                color={temperatureConfig.color}
                unit={temperatureConfig.unit}
                minValue={temperatureConfig.min - 1}
                maxValue={temperatureConfig.max + 1}
              />
              
              <SensorChart
                title="Turbidity History"
                data={turbidityData}
                color={turbidityConfig.color}
                unit={turbidityConfig.unit}
                minValue={turbidityConfig.min}
                maxValue={turbidityConfig.max + 0.5}
              />
              
              <SensorChart
                title="pH History"
                data={phData}
                color={phConfig.color}
                unit={phConfig.unit}
                minValue={phConfig.min - 0.5}
                maxValue={phConfig.max + 0.5}
              />
              
              <DataCard title="Data Statistics" className="animate-in-delay-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Temperature</span>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Avg</div>
                        <div className="text-xl font-light">
                          {(temperatureData.reduce((acc, point) => acc + point.value, 0) / temperatureData.length).toFixed(1)}
                          <span className="text-sm ml-1">{temperatureConfig.unit}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Max</div>
                        <div className="text-xl font-light">
                          {Math.max(...temperatureData.map(point => point.value)).toFixed(1)}
                          <span className="text-sm ml-1">{temperatureConfig.unit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Turbidity</span>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Avg</div>
                        <div className="text-xl font-light">
                          {(turbidityData.reduce((acc, point) => acc + point.value, 0) / turbidityData.length).toFixed(2)}
                          <span className="text-sm ml-1">{turbidityConfig.unit}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Max</div>
                        <div className="text-xl font-light">
                          {Math.max(...turbidityData.map(point => point.value)).toFixed(2)}
                          <span className="text-sm ml-1">{turbidityConfig.unit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">pH Level</span>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Avg</div>
                        <div className="text-xl font-light">
                          {(phData.reduce((acc, point) => acc + point.value, 0) / phData.length).toFixed(1)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Range</div>
                        <div className="text-xl font-light">
                          {Math.min(...phData.map(point => point.value)).toFixed(1)} - {Math.max(...phData.map(point => point.value)).toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DataCard>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Historical;
