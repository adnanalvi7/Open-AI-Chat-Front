import { Textarea } from "@mantine/core";
import ArrowUp from "../assets/ArrowUp";
import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      className="w-full max-h-[375px] mt-4 flex flex-col bg-gray-50 items-end px-5 py-3 rounded-3xl shadow"
    >
      <Textarea
        classNames={{
          root: "w-full !bg-none !border-none",
          wrapper: "!bg-none !border-none",
          input: "!bg-transparent !border-none",
        }}
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
        autosize
        placeholder="Message"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        autoFocus
        minRows={2}
        maxRows={4}
      />
      <button
        type="submit"
        onClick={handleSend}
        className="w-[30px] h-[30px] bg-black rounded-full flex justify-center items-center"
      >
        <ArrowUp />
      </button>
    </form>
  );
}
