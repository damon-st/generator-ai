"use client";

import { Button } from "@/components/ui/button";
import { useCreateChatPDF } from "@/hooks/use-pro-modal";

const CreateChat = () => {
  const useModal = useCreateChatPDF();

  return <Button onClick={useModal.onOpen}>Create new ChatPDF</Button>;
};

export default CreateChat;
