"use client";

import { useEffect, useState } from "react";
import { ProModal } from "@/components/pro-modal";
import { CreateChatPdfModal } from "@/components/create-chat-pdf-modal";

export const ModalProvider = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <ProModal />
      <CreateChatPdfModal />
    </>
  );
};
