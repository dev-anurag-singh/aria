"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto px-4 flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
