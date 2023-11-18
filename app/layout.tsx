import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "@/components/providers/modal-provider";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { CrispProvider } from "@/components/providers/crisp-provider";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Genius",
  description: "Ai",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ReactQueryProvider>
        <html lang="en">
          <CrispProvider />
          <body className={inter.className}>
            <ModalProvider />
            <ToasterProvider />
            {children}
          </body>
        </html>
      </ReactQueryProvider>
    </ClerkProvider>
  );
}
