import { Heading } from "@/components/heading";
import { MessageCircle } from "lucide-react";
import CreateChat from "./_components/create_chat";
import { GetChatsPDFUser } from "./_components/get_chats_user";

export default async function ChatPdfPage() {
  return (
    <div className="w-full p-2 h-full">
      <Heading
        icon={MessageCircle}
        title="Chat PDF"
        description="Chat with PDF any ask from document your upload"
      />
      <div className="w-full mt-2 flex items-center justify-end">
        <CreateChat />
      </div>
      <GetChatsPDFUser />
    </div>
  );
}
