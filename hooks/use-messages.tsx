import { useQuery } from "@tanstack/react-query";
import { Message } from "ai/react";
import axios from "axios";

export const useMessages = (chatId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages-pdf", {
        chatId,
      });
      return response.data;
    },
  });
  return { data, isLoading };
};
