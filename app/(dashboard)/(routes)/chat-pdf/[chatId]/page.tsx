import { Heading } from "@/components/heading";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { MessageCircle } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { PDFViewer } from "../_components/pdf_viewer";
import { ChatComponent } from "../_components/chat_componet";

export default async function ChatPdfIDPage({
  params,
}: {
  params: { chatId: string };
}) {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const chat = await prismadb.chats.findUnique({
    where: {
      id: params.chatId,
    },
  });
  if (!chat) {
    return redirect("/chat-pdf");
  }
  return (
    <div className="w-full h-full p-2">
      <Heading
        icon={MessageCircle}
        title="Chat PDF"
        description="Chat with PDF any ask from document your upload"
      />
      <div className="w-full h-full flex overflow-auto">
        <div className="max-h-screen p-4 overflow-auto flex-[5]">
          <PDFViewer pdf_url={chat?.pdfUrl ?? ""} />
        </div>
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ChatComponent chatId={params.chatId} />
        </div>
      </div>
    </div>
  );
}
