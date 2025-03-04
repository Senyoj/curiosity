
// Generate some mock data for development purposes

// Time constants
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Sensor ranges
const SENSORS = {
  temperature: {
    min: 20,
    max: 30,
    unit: "°C",
    color: "hsl(217, 91%, 60%)",
    fluctuation: 0.5,
  },
  turbidity: {
    min: 0,
    max: 10,
    unit: "NTU",
    color: "hsl(174, 100%, 29%)",
    fluctuation: 0.2,
  },
  ph: {
    min: 6.5,
    max: 8.5,
    unit: "",
    color: "hsl(271, 91%, 65%)",
    fluctuation: 0.1,
  },
};

// Generate a time series of data points
export const generateTimeSeriesData = (
  sensorType: keyof typeof SENSORS,
  numPoints: number,
  intervalMs: number
) => {
  const now = Date.now();
  const sensor = SENSORS[sensorType];
  const data = [];
  
  let lastValue = sensor.min + Math.random() * (sensor.max - sensor.min);
  
  for (let i = 0; i < numPoints; i++) {
    // Add some fluctuation to the previous value
    const fluctuation = (Math.random() - 0.5) * 2 * sensor.fluctuation;
    let newValue = lastValue + fluctuation;
    
    // Ensure value stays within bounds
    newValue = Math.max(sensor.min, Math.min(sensor.max, newValue));
    
    data.push({
      timestamp: now - (numPoints - i - 1) * intervalMs,
      value: newValue,
    });
    
    lastValue = newValue;
  }
  
  return data;
};

// Get current sensor value
export const getCurrentValue = (sensorType: keyof typeof SENSORS) => {
  const sensor = SENSORS[sensorType];
  return sensor.min + Math.random() * (sensor.max - sensor.min);
};

// Get sensor config
export const getSensorConfig = (sensorType: keyof typeof SENSORS) => {
  return SENSORS[sensorType];
};

// Generate alerts
export const generateMockAlerts = (count: number) => {
  const alertTypes = ["warning", "critical", "info"];
  const sensorTypes = Object.keys(SENSORS);
  const alerts = [];
  
  for (let i = 0; i < count; i++) {
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const sensorType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
    const timestamp = Date.now() - Math.floor(Math.random() * DAY);
    
    alerts.push({
      id: `alert-${i}`,
      timestamp,
      type: alertType,
      sensor: sensorType,
      message: `${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} ${
        alertType === "critical" 
          ? "exceeded critical threshold" 
          : alertType === "warning" 
            ? "approaching warning threshold" 
            : "returned to normal range"
      }`,
      value: SENSORS[sensorType as keyof typeof SENSORS].min +
        Math.random() * (SENSORS[sensorType as keyof typeof SENSORS].max - 
        SENSORS[sensorType as keyof typeof SENSORS].min),
      acknowledged: Math.random() > 0.5,
    });
  }
  
  // Sort by timestamp, newest first
  return alerts.sort((a, b) => b.timestamp - a.timestamp);
};
