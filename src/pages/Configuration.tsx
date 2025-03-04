import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { DataCard } from "@/components/ui/DataCard";
import { websocketService } from "@/lib/websocket";
import {
  Settings,
  Save,
  RefreshCw,
  Power,
  Upload,
  Wifi,
  Database,
  Clock,
} from "lucide-react";

const Configuration = () => {
  const [samplingInterval, setSamplingInterval] = useState(30);
  const [temperatureUnit, setTemperatureUnit] = useState("celsius");
  const [isWifiConnected, setIsWifiConnected] = useState(true);
  const [deviceName, setDeviceName] = useState("ESP32-ECO-1");
  const [isCalibrationMode, setIsCalibrationMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const handleSaveConfig = () => {
    setIsSaving(true);

    // Simulate saving configuration to the device
    websocketService.sendCommand("saveConfig", {
      samplingInterval,
      temperatureUnit,
      deviceName,
    });

    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  const handleRestartDevice = () => {
    setIsRestarting(true);

    // Simulate restarting the device
    websocketService.sendCommand("restartDevice", {});

    setTimeout(() => {
      setIsRestarting(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container pt-24 pb-16 px-4 mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-light">Device Configuration</h1>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Settings size={16} />
              <span>Configure curiosity's settings</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-enter">
            <DataCard
              title="Device Information"
              className="animate-in-delay-100"
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="deviceName"
                    className="block text-sm font-medium text-muted-foreground mb-1"
                  >
                    Device Name
                  </label>
                  <input
                    type="text"
                    id="deviceName"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Connection Status
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isWifiConnected ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span>
                      {isWifiConnected ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Device Model
                  </p>
                  <p>ESP32 DevKit V1</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Firmware Version
                  </p>
                  <p>v1.0.3</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRestartDevice}
                    disabled={isRestarting}
                    className="flex items-center gap-2 px-3 py-2 rounded-md border border-destructive bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Power
                      size={16}
                      className={isRestarting ? "animate-pulse" : ""}
                    />
                    <span>
                      {isRestarting ? "Restarting..." : "Restart Device"}
                    </span>
                  </button>

                  <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-accent hover:bg-accent/70 text-sm">
                    <Upload size={16} />
                    <span>Update Firmware</span>
                  </button>
                </div>
              </div>
            </DataCard>

            <DataCard
              title="Sensor Configuration"
              className="animate-in-delay-200"
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="samplingInterval"
                    className="block text-sm font-medium text-muted-foreground mb-1"
                  >
                    Sampling Interval (seconds)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      id="samplingInterval"
                      min={5}
                      max={300}
                      step={5}
                      value={samplingInterval}
                      onChange={(e) =>
                        setSamplingInterval(parseInt(e.target.value))
                      }
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-10">
                      {samplingInterval}s
                    </span>
                  </div>
                </div>

                <div>
                  <p className="block text-sm font-medium text-muted-foreground mb-2">
                    Temperature Unit
                  </p>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="celsius"
                        checked={temperatureUnit === "celsius"}
                        onChange={() => setTemperatureUnit("celsius")}
                        className="h-4 w-4 text-primary border-input rounded"
                      />
                      <span className="ml-2">Celsius (°C)</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="fahrenheit"
                        checked={temperatureUnit === "fahrenheit"}
                        onChange={() => setTemperatureUnit("fahrenheit")}
                        className="h-4 w-4 text-primary border-input rounded"
                      />
                      <span className="ml-2">Fahrenheit (°F)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="calibrationMode"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      id="calibrationMode"
                      checked={isCalibrationMode}
                      onChange={() => setIsCalibrationMode(!isCalibrationMode)}
                      className="h-4 w-4 text-primary border-input rounded"
                    />
                    <span>Enable Calibration Mode</span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    When enabled, raw sensor values will be available for
                    calibration
                  </p>
                </div>

                <button
                  onClick={handleSaveConfig}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Save size={16} className={isSaving ? "animate-pulse" : ""} />
                  <span>{isSaving ? "Saving..." : "Save Configuration"}</span>
                </button>
              </div>
            </DataCard>

            <DataCard
              title="Network Configuration"
              icon={<Wifi size={18} />}
              className="animate-in-delay-300"
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="ssid"
                    className="block text-sm font-medium text-muted-foreground mb-1"
                  >
                    WiFi SSID
                  </label>
                  <input
                    type="text"
                    id="ssid"
                    defaultValue="IoT_Network"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-muted-foreground mb-1"
                  >
                    WiFi Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    defaultValue="********"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    IP Address
                  </p>
                  <p>192.168.1.105</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    MAC Address
                  </p>
                  <p>5C:CF:7F:AC:D3:E4</p>
                </div>

                <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-accent hover:bg-accent/70 text-sm">
                  <RefreshCw size={16} />
                  <span>Scan Networks</span>
                </button>
              </div>
            </DataCard>

            <DataCard
              title="Data Management"
              icon={<Database size={18} />}
              className="animate-in-delay-400"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Storage Status
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2"
                        style={{ width: "23%" }}
                      />
                    </div>
                    <span className="text-sm whitespace-nowrap">
                      23% (4.6 MB / 20 MB)
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Data Retention
                  </p>
                  <select
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    defaultValue="30"
                  >
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                  </select>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Data Sync
                  </p>
                  <select
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    defaultValue="30"
                  >
                    <option value="realtime">Real-time</option>
                    <option value="15">Every 15 minutes</option>
                    <option value="30">Every 30 minutes</option>
                    <option value="60">Every hour</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-accent hover:bg-accent/70 text-sm">
                    <Clock size={16} />
                    <span>Sync Now</span>
                  </button>

                  <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-destructive bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm">
                    <span>Clear Storage</span>
                  </button>
                </div>
              </div>
            </DataCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Configuration;
