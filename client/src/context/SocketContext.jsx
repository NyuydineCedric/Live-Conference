import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const newSocket = io(socketUrl, {
      auth: { token },
      transports: ["websocket", "polling"], // WebSocket first
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected");
      setConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });

    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const emit = useCallback((event, data) => {
    if (socketRef.current) socketRef.current.emit(event, data);
  }, []);

  const on = useCallback((event, callback) => {
    if (socketRef.current) socketRef.current.on(event, callback);
  }, []);

  const off = useCallback((event, callback) => {
    if (socketRef.current) socketRef.current.off(event, callback);
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, connected, emit, on, off }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");
  return context;
}
