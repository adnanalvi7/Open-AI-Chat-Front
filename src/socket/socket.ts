import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3002"; // ✅ Use http:// instead of ws://

export function useChatSocket() {
    const [socket, setSocket] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [receivedMessages, setReceivedMessages] = useState<any[]>([]);
    const [ip, setIp] = useState("");
    const [token, setToken] = useState("")
    useEffect(() => {
        fetch("https://api64.ipify.org?format=json")
            .then((response) => response.json())
            .then((data) => setIp(data.ip))
            .catch((error) => console.error("Error fetching IP:", error));
    }, []);

    useEffect((): any => {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === '__session') {
                console.log(value, 'valuevaluevaluevaluevaluevalue');

                setToken(value);
            }
        }
    }, [token])

    useEffect(() => {
        console.log("what is ip", ip);

        if (!ip) return;
        const newSocket = io(SOCKET_URL, {
            transports: ["websocket"], // Force WebSocket
            reconnection: true, // Enable auto-reconnect
            reconnectionAttempts: 10, // Retry 10 times
            reconnectionDelay: 5000, // Wait 5 seconds between retries
            auth: {
                ipAddress: ip,
                ...(token && { token })
            }
        });

        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("✅ Socket.IO Connected to", SOCKET_URL);
            setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
            console.log("❌ Socket.IO Disconnected, retrying...");
            setIsConnected(false);
        });

        newSocket.on("connect_error", (err) => {
            console.error("⚠️ Socket.IO Connection Error:", err);
        });

        // ✅ Listen for messages from the server
        newSocket.on("message", (data) => {
            console.log("📩 Received message:", data);
            setReceivedMessages((prev) => [...prev, data]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [ip, token]);

    const sendJsonMessage = (message: string) => {
        if (socket && isConnected) {
            socket.emit("message", message); // ✅ Send message to server
        } else {
            console.warn("⚠️ Cannot send message, socket not connected.");
        }
    };

    return {
        sendJsonMessage,
        receivedMessages,
        isConnected,
    };
}
