"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { Header } from "@/components/layout/Header";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { EmptyState } from "@/components/chat/EmptyState";

export default function Page() {
  const { messages, isThinking, sendMessage } = useChat();
  const hasMessages = messages.length > 0;
  const [scrolled, setScrolled] = useState(false);

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-linear-to-br from-violet-200 via-indigo-100 to-blue-200 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-violet-400/40 dark:bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-400/40 dark:bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-indigo-300/30 dark:bg-indigo-500/5 blur-3xl" />
      </div>

      <Header scrolled={scrolled} />

      {hasMessages ? (
        <div
          className="flex-1 overflow-y-auto flex flex-col"
          onScroll={e => setScrolled(e.currentTarget.scrollTop > 20)}
        >
          <div className="flex-1 pt-20 pb-6">
            <MessageList messages={messages} />
          </div>
          <div className="sticky bottom-0 backdrop-blur-xl">
            <ChatInput onSend={sendMessage} disabled={isThinking} />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center w-full">
          <EmptyState />
          <ChatInput onSend={sendMessage} disabled={isThinking} />
        </div>
      )}
    </div>
  );
}
