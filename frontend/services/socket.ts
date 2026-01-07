import io, { Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ["websocket"],
        reconnectionAttempts: 5,
        timeout: 5000,
      });

      this.socket.on("connect", () => {
        console.log("🟢 WebSocket connected:", this.socket?.id);
      });

      this.socket.on("connect_error", (err) => {
        console.warn("⚠️ WebSocket connection error:", err.message);
      });
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("🔴 WebSocket disconnected");
    }
  }

  get instance(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
