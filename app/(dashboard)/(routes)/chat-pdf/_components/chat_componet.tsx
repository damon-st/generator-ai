"use client";
import { Input } from "@/components/ui/input";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { MessageList } from "./message_lists";
import { useEffect } from "react";
import { useMessages } from "@/hooks/use-messages";

type Props = {
  chatId: string;
};

export const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useMessages(chatId);

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat-pdf",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  useEffect(() => {
    const messageContaienr = document.getElementById("message-container");
    if (messageContaienr) {
      messageContaienr.scrollTo({
        top: messageContaienr.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="relative max-h-screen overflow-auto" id="message-container">
      {/* Header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>
      {/* message list */}
      <MessageList messages={messages} isLoading={isLoading} />
      <form
        onSubmit={handleSubmit}
        className="sticky flex bottom-0 inset-x-0 px-2 py-4 bg-white mt-2"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask any question..."
          className="w-full"
        />
        <Button className="bg-blue-600 ml-2">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
