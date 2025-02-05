import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../context/Auth";
import { GET_IP_ADDRESS_URL } from "../constants";

export function useChatSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState<any[]>([]);
  const [ip, setIp] = useState("");
  const { getTokenFromCookie, isAuthenticated } = useAuth();

  useEffect(() => {
    fetch(GET_IP_ADDRESS_URL)
      .then((response) => response.json())
      .then((data) => setIp(data.ip))
      .catch((error) => console.error("Error fetching IP:", error));
  }, []);

  useEffect(() => {
    if (!ip) return;
    const SOCKET_URL =
      process.env.REACT_APP_SOCKET_URL || "http://localhost:3002";
    const token = getTokenFromCookie();
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 5000,
      auth: {
        ipAddress: ip,
        ...(token && isAuthenticated ? { token } : {}),
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket.IO Connection Error:", err);
    });

    newSocket.on("message", (data) => {
      setReceivedMessages((prev) => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [ip, isAuthenticated]);

  const sendJsonMessage = (message: string) => {
    if (socket && isConnected) {
      socket.emit("message", message);
    } else {
      console.warn("Cannot send message, socket not connected.");
    }
  };

  return {
    sendJsonMessage,
    receivedMessages,
    isConnected,
  };
}
