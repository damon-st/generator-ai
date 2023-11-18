"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface DeleteChatPdfProps {
  id: string;
}

export const DeleteChatPdf = ({ id }: DeleteChatPdfProps) => {
  const onRemove = () => {};
  return (
    <Button onClick={onRemove} variant="destructive" size="icon">
      <Trash className="text-white h-4 w-4" />
    </Button>
  );
};
