
# Project Curiosity

A  web application for real-time monitoring of environmental parameters using ESP32 microcontrollers. This dashboard provides a modern interface to track temperature, turbidity, and pH levels with both real-time and historical data visualization.



## Project Overview

This project creates a professional IoT monitoring application that interfaces with ESP32 microcontrollers to measure and display real-time environmental data for industrial applications. The application follows a minimalist design inspired by Apple and Dieter Rams' principles, focusing on usability and clarity.

## Features

### 1. Real-time Dashboard
- Live monitoring of temperature, turbidity, and pH sensors
- Visual indicators for normal, warning, and critical states
- Animated value changes for better UX
- 30-second data refresh interval

### 2. Historical Data Visualization
- Time-series charts for each parameter
- Interactive tooltips showing exact values and timestamps
- Collapsible chart sections
- 1-hour historical data retention

### 3. Device Configuration
- WebSocket connection management
- Easy switching between real device and mock data
- Connection status indicators
- Automatic reconnection handling

### 4. System Architecture
- React and TypeScript front-end
- WebSocket communication with ESP32
- Responsive design using Tailwind CSS
- Component-based architecture with shadcn/ui

## Technical Implementation

### WebSocket Communication

The application uses a WebSocket service to communicate with ESP32 devices:

- **Mock Data Mode**: Generates simulated sensor data for development and testing
- **Real Device Mode**: Connects to an actual ESP32 device via WebSocket
- **Automatic Reconnection**: Implements exponential backoff for connection failures
- **Connection Status Tracking**: Provides visual feedback on connection state

### Component Structure

1. **Dashboard Components**:
   - `SensorCard`: Displays individual sensor readings with status indicators
   - `SensorChart`: Visualizes historical data for each sensor
   - `StatusIndicator`: Shows real-time connection status

2. **Configuration Components**:
   - `DeviceConnection`: Interface for connecting to ESP32 devices
   - Form for entering WebSocket URL and managing connection

3. **UI Components**:
   - `DataCard`: Reusable card component for consistent styling
   - Toast notifications for connection events
   - Responsive layout adapting to different screen sizes

### Data Flow

1. ESP32 device collects sensor data every 30 seconds
2. Data is transmitted via WebSocket to the web application
3. Application processes and displays the data in real-time
4. Historical data is stored in memory for charting (last 60 data points)
5. UI components update with smooth animations

## ESP32 Integration Guide

### Connecting Your ESP32 Device

1. Ensure your ESP32 is properly set up with the required sensors:
   - Temperature sensor
   - Turbidity sensor
   - pH sensor

2. Flash the ESP32 with WebSocket server code that outputs JSON in this format:
   ```json
   {
     "temperature": 25.5,
     "turbidity": 3.2,
     "ph": 7.1,
     "timestamp": 1620000000000
   }
   ```

3. Connect your ESP32 to your local network

4. Navigate to the Configuration page in the web application

5. Enter the WebSocket URL of your ESP32 (e.g., ws://192.168.1.100:81)

6. Click "Connect" to establish a connection

7. The dashboard will now display real-time data from your ESP32

### Mock Data Mode

If you don't have an ESP32 device yet:

1. The application defaults to Mock Data Mode
2. Simulated sensor readings are generated every 30 seconds
3. You can always switch back to Mock Data Mode from the Configuration page

## Project Development Journey

### Phase 1: Initial Setup and UI Framework
- Created project structure with React, TypeScript, and Vite
- Implemented responsive layout with Tailwind CSS
- Set up shadcn/ui components for consistent design
- Developed base UI components like DataCard

### Phase 2: Dashboard Implementation
- Created SensorCard component for displaying real-time values
- Implemented status indicators for sensor readings
- Added animated value changes for a more dynamic UI
- Developed time-series charts for historical data visualization

### Phase 3: WebSocket Communication
- Created WebSocket service for handling device communication
- Implemented mock data generation for development
- Added connection management with auto-reconnect features
- Integrated real-time data updates to dashboard components

### Phase 4: Configuration Interface
- Developed device connection form
- Added status indicators for connection state
- Implemented switching between mock and real device modes
- Created toast notifications for connection events

## Future Enhancements

Planned features for future releases:

1. User authentication and multi-user support
2. Data export functionality (CSV, JSON)
3. Configurable alert thresholds and notifications
4. Sensor calibration interface
5. Dark/light theme support
6. Multi-language support
7. Mobile responsive optimizations

## Technical Requirements

- Modern web browser with WebSocket support
- ESP32 device with temperature, turbidity, and pH sensors
- Local network connectivity between device and browser

## Installation and Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the application at: http://localhost:5173

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React, TypeScript, and Tailwind CSS
- UI components from shadcn/ui
- Charts powered by Recharts
- Icons from Lucide React