import { Container, Dialog } from "@mantine/core";
import Header from "./Header";
import ChatInput from "./ChatInput";
import { useEffect, useState } from "react";
import { useChatSocket } from "../socket/socket";
import { ThreeDots } from "react-loader-spinner";
import { useDisclosure } from "@mantine/hooks";
import AuthenticationDialog from "./authenticationDialog/AuthenticationDialog";

export default function Chat() {
  const [currentMessage, setCurrentMessage] = useState(""); // Store the typed message
  const [responseMessage, setResponseMessage] = useState(null); // Store the WebSocket response
  const [loading, setLoading] = useState(false); // Loader state
  const [opened, { toggle, close }] = useDisclosure(false);

  // ✅ WebSocket setup
  const { sendJsonMessage, receivedMessages, isConnected } = useChatSocket();
  // ✅ Update response message when WebSocket receives a new message
  useEffect(() => {
    if (receivedMessages.length > 0) {
      if (!receivedMessages[receivedMessages.length - 1].success) {
        toggle();
      } else {
        setResponseMessage(
          receivedMessages[receivedMessages.length - 1].message
        );
      }
      setLoading(false); // Stop loader when message arrives
    }
  }, [receivedMessages]);

  // ✅ Function to send message via WebSocket
  const sendMessage = (text: string) => {
    if (!isConnected) {
      console.warn("⚠️ Socket.IO not connected. Message not sent.");
      return;
    }
    setCurrentMessage(text); // Store the typed message
    sendJsonMessage(text);
    setLoading(true); // Start loader when message is sent
  };

  return (
    <Container className="!h-screen flex pb-3 flex-col items-center w-full !max-w-full justify-between">
      <div className="fixed bg-white top-0 left-0 w-full">
        <Header />
      </div>
      <div className="w-full pb-3 h-auto flex justify-center overflow-auto">
        <div className="w-3/5 sm:!w-full flex flex-col items-end !mt-24">
          {currentMessage && (
            <div className="!w-[60%] !bg-[#f2f2f280] h-full mt-4 py-5 px-8 !rounded-3xl shadow-md">
              <span className="break-words leading-6 tracking-wid font-Barlow h-full !text-lg font-medium text-gray-600">
                <strong>You:</strong> {currentMessage}
              </span>
            </div>
          )}
          {loading && (
            <div className="!w-[100%] flex justify-center items-center mt-4">
              <ThreeDots
                visible={true}
                height="80"
                width="80"
                color="#000000"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          )}
          {responseMessage && !loading && (
            <div className="flex w-[100%] tracking-wide flex-col gap-1 empty:hidden mt-8 first:pt-[3px]">
              <span className="break-words leading-6 tracking-wid font-Barlow h-full !text-lg font-medium text-gray-700">
                <strong>Bot:</strong> {responseMessage}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="w-3/5 sm:!w-full">
        <ChatInput onSendMessage={sendMessage} />
      </div>
      <Dialog
        onClick={close}
        classNames={{
          root: "!shadow-gray-600 !shadow-lg",
        }}
        position={{ top: "45%", left: "45%" }}
        opened={opened}
      >
        <AuthenticationDialog close={close} />
      </Dialog>
    </Container>
  );
}
