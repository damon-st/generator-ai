import { Card, CardContent } from "@/components/ui/card";
import prismadb from "@/lib/prismadb";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { DeleteChatPdf } from "./delete_chat_pdf";

export const GetChatsPDFUser = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const chats = await prismadb.chats.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {chats.map((chat) => (
        <Link key={chat.id} href={`/chat-pdf/${chat.id}`}>
          <Card className="hover:scale-105 transition">
            <CardContent>
              <div
                className={cn("rounded-lg p-3  text-black flex items-center")}
              >
                <MessageCircle className="mr-2" />
                <p className="w-full overflow-hidden text-sm truncate whitespace-normal text-ellipsis">
                  {chat.pdfName}
                </p>
                <DeleteChatPdf id={chat.id} />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
