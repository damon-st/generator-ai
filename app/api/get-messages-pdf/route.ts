import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { chatId } = await req.json();
  const _messages = await prismadb.messages.findMany({
    where: {
      chatId,
    },
  });

  return NextResponse.json(_messages);
}
