
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { DataCard } from "@/components/ui/DataCard";
import { generateMockAlerts, getSensorConfig } from "@/lib/mockData";
import { Bell, BellOff, PlusCircle, AlertTriangle, ThumbsUp, AlertCircle, Clock, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Alert {
  id: string;
  timestamp: number;
  type: "warning" | "critical" | "info";
  sensor: string;
  message: string;
  value: number;
  acknowledged: boolean;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<"all" | "unacknowledged">("all");
  const [isLoading, setIsLoading] = useState(true);
  
  const [temperatureAlertMin, setTemperatureAlertMin] = useState(20);
  const [temperatureAlertMax, setTemperatureAlertMax] = useState(30);
  const [turbidityAlertMax, setTurbidityAlertMax] = useState(7);
  const [phAlertMin, setPhAlertMin] = useState(6.5);
  const [phAlertMax, setPhAlertMax] = useState(8.5);
  
  const temperatureConfig = getSensorConfig("temperature");
  const turbidityConfig = getSensorConfig("turbidity");
  const phConfig = getSensorConfig("ph");
  
  useEffect(() => {
    // Simulate loading alerts
    setIsLoading(true);
    
    setTimeout(() => {
      const mockAlerts = generateMockAlerts(8);
      setAlerts(mockAlerts);
      setIsLoading(false);
    }, 1500);
  }, []);
  
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };
  
  const handleDeleteAlert = (alertId: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId));
  };
  
  const handleAcknowledgeAll = () => {
    setAlerts(
      alerts.map((alert) => ({ ...alert, acknowledged: true }))
    );
  };
  
  const handleClearAlerts = () => {
    setAlerts([]);
  };
  
  const filteredAlerts = filter === "all" 
    ? alerts 
    : alerts.filter((alert) => !alert.acknowledged);
  
  const getAlertIcon = (type: "warning" | "critical" | "info") => {
    switch (type) {
      case "critical":
        return <AlertCircle className="text-destructive" size={18} />;
      case "warning":
        return <AlertTriangle className="text-amber-500" size={18} />;
      case "info":
        return <ThumbsUp className="text-green-500" size={18} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container pt-24 pb-16 px-4 mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-light">Alerts</h1>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Bell size={16} />
              <span>Manage sensor alerts and thresholds</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-enter">
            <DataCard title="Alert Thresholds" className="animate-in-delay-100">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium mb-2">Temperature Thresholds</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Minimum ({temperatureConfig.unit})
                      </label>
                      <input
                        type="number"
                        value={temperatureAlertMin}
                        onChange={(e) => setTemperatureAlertMin(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Maximum ({temperatureConfig.unit})
                      </label>
                      <input
                        type="number"
                        value={temperatureAlertMax}
                        onChange={(e) => setTemperatureAlertMax(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Turbidity Threshold</p>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Maximum ({turbidityConfig.unit})
                    </label>
                    <input
                      type="number"
                      value={turbidityAlertMax}
                      onChange={(e) => setTurbidityAlertMax(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">pH Thresholds</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Minimum
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={phAlertMin}
                        onChange={(e) => setPhAlertMin(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Maximum
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={phAlertMax}
                        onChange={(e) => setPhAlertMax(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
                  <span>Save Thresholds</span>
                </button>
              </div>
            </DataCard>
            
            <DataCard title="Notification Settings" className="animate-in-delay-200">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Notification Channels</p>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={true}
                        className="h-4 w-4 text-primary border-input rounded"
                      />
                      <span>In-app notifications</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={true}
                        className="h-4 w-4 text-primary border-input rounded"
                      />
                      <span>Email notifications</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={false}
                        className="h-4 w-4 text-primary border-input rounded"
                      />
                      <span>SMS notifications</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Alert Types</p>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={true}
                        className="h-4 w-4 text-primary border-input rounded"
                      />
                      <span>Critical alerts</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={true}
                        className="h-4 w-4 text-primary border-input rounded"
                      />
                      <span>Warning alerts</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={false}
                        className="h-4 w-4 text-primary border-input rounded"
                      />
                      <span>Information alerts</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Email Recipients</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className="flex-1 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button className="flex items-center gap-1 p-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/70">
                      <PlusCircle size={18} />
                    </button>
                  </div>
                  <div className="mt-2 px-3 py-2 bg-secondary/50 rounded-md">
                    <div className="flex items-center justify-between">
                      <span>admin@example.com</span>
                      <button className="text-muted-foreground hover:text-destructive">
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </DataCard>
            
            <DataCard
              title="Alert History"
              className="col-span-full animate-in-delay-300"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                        filter === "all"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-accent-foreground hover:bg-accent/70"
                      }`}
                    >
                      All Alerts
                    </button>
                    <button
                      onClick={() => setFilter("unacknowledged")}
                      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                        filter === "unacknowledged"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-accent-foreground hover:bg-accent/70"
                      }`}
                    >
                      Unacknowledged
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleAcknowledgeAll}
                      disabled={alerts.length === 0 || alerts.every(a => a.acknowledged)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-accent text-accent-foreground hover:bg-accent/70 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <BellOff size={16} />
                      <span>Acknowledge All</span>
                    </button>
                    <button
                      onClick={handleClearAlerts}
                      disabled={alerts.length === 0}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <Trash size={16} />
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="py-12 flex justify-center items-center">
                    <p className="text-muted-foreground">Loading alerts...</p>
                  </div>
                ) : filteredAlerts.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                    <Bell size={32} className="mb-2" />
                    <p>No alerts to display</p>
                  </div>
                ) : (
                  <div className="space-y-3 animate-fade-in">
                    {filteredAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-md border border-border/50 flex items-center justify-between ${
                          !alert.acknowledged ? "bg-accent/50" : "bg-background/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div>{getAlertIcon(alert.type)}</div>
                          <div>
                            <div className="font-medium">{alert.message}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Clock size={12} />
                              <span>
                                {formatDistanceToNow(new Date(alert.timestamp), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!alert.acknowledged && (
                            <button
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                              className="p-1.5 rounded-md hover:bg-accent"
                              title="Acknowledge"
                            >
                              <BellOff size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAlert(alert.id)}
                            className="p-1.5 rounded-md hover:bg-accent"
                            title="Delete"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DataCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Alerts;
