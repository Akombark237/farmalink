'use client';
import { Bot } from 'lucide-react';
import Link from 'next/link';

export default function ChatWidgetSimple() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="/use-pages/medical-assistant"
        className="h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center"
      >
        <Bot className="h-7 w-7 text-white" />
      </Link>
    </div>
  );
}