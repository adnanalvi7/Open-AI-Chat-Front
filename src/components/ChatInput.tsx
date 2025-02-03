import { Textarea } from "@mantine/core";
import ArrowUp from "../assets/ArrowUp";
import { useState } from "react";

interface ChatInputProps {
    onSendMessage: (message: string) => void; // Accepts function to send message
  }

export default function ChatInput ({ onSendMessage }: ChatInputProps) {
    const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message); // Send message via WebSocket
      setMessage(""); // Clear input after sending
    }
  };
    return <div className="w-full max-h-[375px] mt-4 flex flex-col items-end px-5 py-3 bg-[#f2f2f280] rounded-3xl shadow-md">
        <Textarea classNames={{
            root: 'w-full !bg-none !border-none',
            wrapper:'!bg-none !border-none',
            input: '!bg-transparent !border-none'
        }}
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}

        autosize
        minRows={2}
        maxRows={4}
      />
      <div className="w-[30px] h-[30px] bg-black rounded-full flex justify-center items-center"
      onClick={handleSend}>
        <ArrowUp />
      </div>
      
    </div>
}