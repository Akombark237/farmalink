import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import SimpleChatButton from "@/components/SimpleChatButton";
import ChatWidgetSimple from "@/components/ChatWidgetSimple";
import BackgroundWrapper from "@/components/BackgroundWrapper";

export const metadata: Metadata = {
  title: "PharmaLink - Find Medications Easily",
  description: "Connect with local pharmacies, check medication availability, and get medical assistance with Qala-Lwazi AI assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased global-background">
        <BackgroundWrapper>
          {children}
          <ChatWidgetSimple />
        </BackgroundWrapper>
      </body>
    </html>
  );
}
