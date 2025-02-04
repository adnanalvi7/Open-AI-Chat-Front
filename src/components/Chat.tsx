import { Container, Modal } from "@mantine/core";
import Header from "./Header";
import ChatInput from "./ChatInput";
import { useEffect, useState } from "react";
import { useChatSocket } from "../socket/socket";
import { ThreeDots } from "react-loader-spinner";
import { useDisclosure } from "@mantine/hooks";
import AuthenticationDialog from "./authenticationDialog/AuthenticationDialog";

interface Chat {
  message: string;
  response: string;
}

export default function Chat() {
  const [currentMessage, setCurrentMessage] = useState(""); // Store the typed message
  // const [responseMessage, setResponseMessage] = useState(null); // Store the WebSocket response
  const [loading, setLoading] = useState(false); // Loader state
  const [opened, { toggle, close }] = useDisclosure(false);
  const [authType, setAuthType] = useState<"login" | "signup" | "">("");
  const [chats, setChats] = useState<Chat[]>([]);

  const { sendJsonMessage, receivedMessages, isConnected } = useChatSocket();

  useEffect(() => {
    if (receivedMessages.length > 0) {
      if (!receivedMessages[receivedMessages.length - 1].success) {
        toggle();
        setAuthType("");
      } else {
        setChats((prev) =>
          prev.map((chat) =>
            chat.message === currentMessage
              ? {
                  ...chat,
                  response:
                    receivedMessages[receivedMessages.length - 1].message,
                }
              : chat
          )
        );
        goToBottom();
      }
      setLoading(false); // Stop loader when message arrives
    }
  }, [receivedMessages]);

  const goToBottom = () => {
    const element = document.getElementById("bottom-chat");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sendMessage = (text: string) => {
    if (!isConnected) {
      console.warn("⚠️ Socket.IO not connected. Message not sent.");
      return;
    }
    setCurrentMessage(text);
    sendJsonMessage(text);
    setChats((prev) => [...prev, { message: text, response: "" }]);
    setLoading(true);
    goToBottom();
  };

  return (
    <Container className="!h-screen flex pb-3 flex-col items-center w-full !max-w-full justify-between">
      <div className="fixed bg-white top-0 left-0 w-full">
        <Header toggle={toggle} setAuthType={setAuthType} />
      </div>
      <div className="w-full pb-6 h-auto flex justify-center overflow-auto">
        <div className="w-3/5 sm:!w-full flex flex-col items-end !mt-24 pb-5">
          {chats.length === 0 && (
            <div className="text-4xl font-bold text-center w-full">
              What can I help with?
            </div>
          )}
          {chats.map((chat) => (
            <>
              <div className="!w-[60%] shadow h-full mt-4 py-4 px-6 !rounded-3xl">
                <span className="break-words leading-6 tracking-wid font-Barlow h-full !text-lg font-medium text-gray-600">
                  {chat.message}
                </span>
              </div>

              {chat.response && (
                <div className="flex w-[100%] tracking-wide flex-col gap-1 empty:hidden mt-8 first:pt-[3px]">
                  <span className="break-words leading-6 tracking-wid font-Barlow h-full !text-lg font-medium text-gray-700">
                    {chat.response}
                  </span>
                </div>
              )}
            </>
          ))}
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
          <div id="bottom-chat" />
        </div>
      </div>
      <div className="w-3/5 sm:!w-full">
        <ChatInput onSendMessage={sendMessage} />
      </div>

      <Modal
        opened={opened}
        onClose={() => {
          close();
          setAuthType("");
        }}
        centered
      >
        <AuthenticationDialog close={close} authType={authType} />
      </Modal>
    </Container>
  );
}
