"use client";

import { useCreateChatPDF } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Inbox, Loader2 } from "lucide-react";
import { generateComponents } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

import { UploadFileResponse } from "uploadthing/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();
export const CreateChatPdfModal = () => {
  const router = useRouter();
  const [uploadthing, setuploadthing] = useState(false);
  const useModal = useCreateChatPDF();

  const onClientUploadComplete = async (
    data: UploadFileResponse[] | undefined
  ) => {
    if (!data) {
      toast.error("Error in upload pdf please reaply again");
      return;
    }
    setuploadthing(true);
    const result = {
      file_key: data![0].key,
      file_name: data![0].name,
      file_url: data![0].url,
    };

    try {
      const response = await axios.post("/api/create-chat-pdf", result);
      const { chat_id } = response.data;
      toast.success("Chat created");
      setuploadthing(false);
      router.push(`/chat-pdf/${chat_id}`);
      router.refresh();
      useModal.onClose();
    } catch (err) {
      console.log(err);
      toast.error("Error creating chat");
      setuploadthing(false);
    }
  };

  const onClose = () => {
    if (uploadthing) return;
    useModal.onClose();
  };
  return (
    <Dialog open={useModal.isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="p-2 bg-white rounded-xl">
          {!uploadthing ? (
            <UploadDropzone
              className="border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col"
              endpoint="imageUploader"
              config={{
                mode: "auto",
              }}
              onClientUploadComplete={onClientUploadComplete}
              content={{
                label: "Drop PDF Here",
                uploadIcon: (
                  <>
                    <Inbox className="w-10 h-10 text-blue-500" />
                  </>
                ),
              }}
            ></UploadDropzone>
          ) : (
            <div className="border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="mt-2 text-sm text-slate-400">
                Spilling Tea to GPT...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
