import { loadIntoPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { utapi } from "../uploadthing/core";

export async function POST(req: Request) {
  try {
    const { file_key, file_name, file_url } = await req.json();
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      await utapi.deleteFiles(file_key);
      return new NextResponse("Free trial has expired", { status: 403 });
    }
    await loadIntoPinecone(file_key);
    const chat_id = await prismadb.chats.create({
      data: {
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: file_url,
        userId,
      },
    });
    if (!isPro) {
      await increaseApiLimit();
    }
    return NextResponse.json({ chat_id: chat_id.id }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: `Inernal error`,
      status: 500,
    });
  }
}
