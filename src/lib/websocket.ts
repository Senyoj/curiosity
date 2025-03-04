interface WebSocketMessage {
  type: string;
  data: any;
}

class MockWebSocketService {
  private listeners: Record<string, Function[]> = {};
  private connected = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private mockDataInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Simulate connection delay
    setTimeout(() => {
      this.connect();
    }, 1500);
  }

  public connect(): void {
    console.log("WebSocket: Connecting...");

    // Simulate connection success after a delay
    setTimeout(() => {
      this.connected = true;
      this.emit("connection", { status: "connected" });
      console.log("WebSocket: Connected");

      // Start sending mock data
      this.startMockDataStream();
    }, 1000);
  }

  public disconnect(): void {
    console.log("WebSocket: Disconnecting...");

    if (this.mockDataInterval) {
      clearInterval(this.mockDataInterval);
      this.mockDataInterval = null;
    }

    this.connected = false;
    this.emit("connection", { status: "disconnected" });
    console.log("WebSocket: Disconnected");
  }

  public reconnect(): void {
    this.disconnect();

    console.log("WebSocket: Reconnecting...");
    this.emit("connection", { status: "reconnecting" });

    // Attempt to reconnect after a delay
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, 2000);
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public on(event: string, callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  public off(event: string, callback: Function): void {
    if (!this.listeners[event]) return;

    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback
    );
  }

  private emit(event: string, data: any): void {
    if (!this.listeners[event]) return;

    this.listeners[event].forEach((callback) => {
      callback(data);
    });
  }

  private startMockDataStream(): void {
    if (this.mockDataInterval) {
      clearInterval(this.mockDataInterval);
    }

    this.mockDataInterval = setInterval(() => {
      if (!this.connected) return;

      const mockData = {
        temperature: 20 + Math.random() * 10,
        turbidity: Math.random() * 10,
        ph: 6.5 + Math.random() * 2,
        timestamp: Date.now(),
      };

      this.emit("data", mockData);
      console.log("WebSocket: Mock data sent", mockData);
    }, 30000);

    // Send initial data immediately
    const initialData = {
      temperature: 20 + Math.random() * 10,
      turbidity: Math.random() * 10,
      ph: 6.5 + Math.random() * 2,
      timestamp: Date.now(),
    };

    this.emit("data", initialData);
    console.log("WebSocket: Initial mock data sent", initialData);
  }

  public sendCommand(command: string, params: any): void {
    if (!this.connected) {
      console.error("WebSocket: Cannot send command, not connected");
      return;
    }

    console.log(`WebSocket: Sending command ${command}`, params);

    // Simulate command acknowledgment after a delay
    setTimeout(() => {
      this.emit("commandResponse", {
        command,
        status: "success",
        message: `Command ${command} executed successfully`,
        timestamp: Date.now(),
      });
    }, 500);
  }
}

// Export a singleton instance
export const websocketService = new MockWebSocketService();
