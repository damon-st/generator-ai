"use client";

interface PdfViewer {
  pdf_url: string;
}

export const PDFViewer = ({ pdf_url }: PdfViewer) => {
  return (
    <iframe
      src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
      className="w-full h-full"
    ></iframe>
  );
};
