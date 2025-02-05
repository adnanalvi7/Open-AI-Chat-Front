import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../context/Auth";

const SOCKET_URL = "http://localhost:3002";
const IP_ADDRESS_URL = "https://api64.ipify.org?format=json";

const useChatSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState<any[]>([]);
  const [ip, setIp] = useState("");
  const { getTokenFromCookie, isAuthenticated } = useAuth();

  useEffect(() => {
    fetch(IP_ADDRESS_URL)
      .then((response) => response.json())
      .then((data) => setIp(data.ip))
      .catch((error) => console.error("Error fetching IP:", error));
  }, []);

  useEffect(() => {
    if (!ip) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ip, isAuthenticated]);

  const sendJsonMessage = (message: string) => {
    if (socket && isConnected) {
      socket.emit("message", message);
    } else {
      console.warn("Cannot send message, socket not connected.");
    }
  };

  return {
    receivedMessages,
    sendJsonMessage,
    isConnected,
  };
};

export default useChatSocket;
